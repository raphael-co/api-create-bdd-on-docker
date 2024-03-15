// DockerService.ts
import { exec } from 'child_process';
import util from 'util';
import * as net from 'net';
import { DatabaseService } from '../DatabaseService/DatabaseService';
import { PortsCheck } from '../PortsCheck/PortsCheck';

const execCallback = util.promisify(exec);

interface Mount {
    Type: string;
    Name: string;
}

type DbType = 'postgres' | 'mariadb';

export class DockerService {

    static async findAvailablePort(start: number, end: number): Promise<number> {
        const portIsOpen = async (port: number) => {
            return new Promise((resolve) => {
                const server = net.createServer();
                server.listen(port, () => {
                    server.once('close', () => {
                        resolve(true);
                    });
                    server.close();
                });
                server.on('error', () => {
                    resolve(false);
                });
            });
        };

        for (let port = start; port <= end; port++) {
            const isOpen = await portIsOpen(port);
            const isAvailableExternally = await PortsCheck.checkPortAvailability(port);
            const [rows] = await DatabaseService.queryDatabase(`SELECT Port FROM bddInfo WHERE Port = ${port}`);

            // Check if the port is open, available externally, and not found in the database
            if (isOpen && isAvailableExternally && rows.length === 0) {
                return port;
            }
        }
        throw new Error('No available ports found');
    }


    private static portRange = {
        postgres: [10001, 10100],
        mariadb: [10101, 10200],
    };

    static async createContainer(name: string, type: DbType, config: [string, string, string, string], dbVersion: string): Promise<{ success: boolean; containerId?: string; port?: number; error?: string }> {
        let dockerCommand = 'docker';

        const availablePort = await this.findAvailablePort(this.portRange[type][0], this.portRange[type][1]);

        if (!availablePort) {
            return { success: false, error: "No available ports found." };
        }

        let dockerArgs = await this.buildDockerArgs(name, type, config, dbVersion, availablePort);

        try {
            const { stdout } = await execCallback(`${dockerCommand} ${dockerArgs.join(' ')}`);
            const containerId = stdout.trim();
            const getAllocatedPort = await this.getAllocatedPort(containerId, type);

            return { success: true, containerId, port: getAllocatedPort };
        } catch (error: any) {
            console.error(`Error creating Docker container: ${error}`);
            return { success: false, error: `Error creating Docker container: ${error.message}` };
        }
    }

    static async removeContainer(containerId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            exec(`docker rm -f ${containerId}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error removing Docker container: ${error}`);
                    return reject(error);
                }
                resolve();
            });
        });
    }

    private static async getAllocatedPort(containerId: string, type: DbType): Promise<number> {
        const portMappingCommand = `docker port ${containerId}`;
        const { stdout } = await execCallback(portMappingCommand);
        const portMappingOutput = stdout.trim();

        const regex = type === 'postgres' ? /5432\/tcp -> .+:(\d+)/ : /3306\/tcp -> .+:(\d+)/;
        const match = portMappingOutput.match(regex);
        return match ? parseInt(match[1], 10) : 0;
    }
    private static async buildDockerArgs(name: string, type: DbType, config: [string, string, string, string], dbVersion: string, port: number): Promise<string[]> {
        let dockerArgs: string[];

        if (type === "postgres") {
            dockerArgs = [
                'run', '--name', name,
                '--env', 'POSTGRES_PASSWORD=' + config[0],
                '--env', 'POSTGRES_USER=' + config[1],
                '--env', 'POSTGRES_DB=' + config[2],
                '-p', `${port}:5432`, // Utilise le port disponible
                '-d', `postgres:${dbVersion}`
            ];
        } else if (type === "mariadb") {
            dockerArgs = [
                'run', '--name', name,
                '--env', 'MARIADB_PASSWORD=' + config[0],
                '--env', 'MARIADB_USER=' + config[1],
                '--env', 'MARIADB_DATABASE=' + config[2],
                '--env', 'MARIADB_ROOT_PASSWORD=' + config[3],
                '-p', `${port}:3306`, // Utilise le port disponible
                '-d', `mariadb:${dbVersion}`
            ];
        } else {
            dockerArgs = [];
        }
        return dockerArgs;
    }

    static async getContainerStorageUsed(containerId: string): Promise<string> {
        try {
            const { stdout } = await execCallback(`docker inspect --format='{{json .Mounts}}' ${containerId}`);
            const mounts: Mount[] = JSON.parse(stdout.trim());
            const volumeSizesPromises = mounts.filter(mount => mount.Type === "volume").map(async (mount) => {
                const inspectCommand = `docker run --rm -v ${mount.Name}:/data alpine du -sh /data | cut -f1`;
                const { stdout: sizeOutput } = await execCallback(inspectCommand);
                const sizeWithUnit = sizeOutput.trim();
                const sizeInBytes = this.convertSizeToBytes(sizeWithUnit);

                return sizeInBytes;
            });

            const volumeSizes = await Promise.all(volumeSizesPromises);
            const totalSizeInBytes = volumeSizes.reduce((acc, size) => acc + size, 0);
            const totalSizeInGigabytes = totalSizeInBytes / (1024 * 1024 * 1024);
            return totalSizeInGigabytes.toFixed(2) + ' GB';
        } catch (error) {
            console.error(`Error calculating Docker container storage used: ${error}`);
            throw error;
        }
    }

    static convertSizeToBytes(sizeWithUnit: string): number {
        const units: { [key: string]: number } = {
            K: 1024,
            M: 1024 * 1024,
            G: 1024 * 1024 * 1024,
        };
        const regex = /([\d\.]+)([KMG])/;
        const match = sizeWithUnit.match(regex);
        if (match) {
            const value = parseFloat(match[1]);
            const unit = match[2];
            return value * (units[unit] || 1);
        }
        return 0;
    }

    static async restartContainer(containerId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            exec(`docker restart ${containerId}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error restarting Docker container: ${error}`);
                    return reject(error);
                }
                resolve();
            });
        });
    }

    static async stopContainer(containerId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            exec(`docker stop ${containerId}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error pausing Docker container: ${error}`);
                    return reject(error);
                }
                resolve();
            });
        });
    }

    static async startContainer(containerId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            exec(`docker start ${containerId}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error unpausing Docker container: ${error}`);
                    return reject(error);
                }
                resolve();
            });
        });
    }

    static async isContainerRunning(containerId: string): Promise<boolean> {
        try {
            const { stdout } = await execCallback(`docker inspect --format='{{.State.Running}}' ${containerId}`);
            return stdout.trim() === 'true';
        } catch (error) {
            console.error(`Error checking if Docker container is running: ${error}`);
            throw error;
        }
    }
    static async getContainerPorts(containerId: string): Promise<string> {
        try {
            const { stdout } = await execCallback(`docker port ${containerId}`);
            const portMatch = stdout.match(/-> 0\.0\.0\.0:(\d+)/);
            if (portMatch && portMatch[1]) {
                return portMatch[1].trim();
            }
            throw new Error('No port found');
        } catch (error) {
            console.error(`Error fetching Docker container ports: ${error}`);
            throw error;
        }
    }
}
