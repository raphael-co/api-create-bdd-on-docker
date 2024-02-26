// DockerService.ts
import { exec } from 'child_process';
import util from 'util';
import * as net from 'net';

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
                const server = net.createServer()
                server.listen(port, () => {
                    server.once('close', () => {
                        resolve(true)
                    })
                    server.close()
                })
                server.on('error', () => {
                    resolve(false)
                })
            })
        }

        for (let port = start; port <= end; port++) {
            if (await portIsOpen(port)) {
                return port
            }
        }
        throw new Error('No available ports found')
    }

    private static portRange = {
        postgres: [5501, 5600],
        mariadb: [5601, 5700],
    };

    static async createContainer(name: string, type: DbType, config: [string, string, string, string], dbVersion: string):  Promise<{ containerId: string; port: number }> {
        let dockerCommand = 'docker';

        const portStart = this.portRange[type][0];
        const portEnd = this.portRange[type][1];

        const availablePort = await this.findAvailablePort(portStart, portEnd);

        let dockerArgs = this.buildDockerArgs(name, type, config, dbVersion, availablePort); // Passer availablePort ici

        return new Promise((resolve, reject) => {
            exec(`${dockerCommand} ${dockerArgs.join(' ')}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error creating Docker container: ${error}`);
                    return reject(error);
                }
                resolve({ containerId: stdout.trim(), port: availablePort });
            });
        });
    }

    static async removeContainer(containerId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            exec(`docker rm -f ${containerId}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error removing Docker container: ${error}`);
                    return reject(error);
                }
                console.log(`Docker container removed: ${containerId}`);
                resolve();
            });
        });
    }

    private static buildDockerArgs(name: string, type: string, config: [string, string, string, string], dbVersion: string, availablePort: number): string[] {
        let dockerArgs: string[];
        if (type === "postgres") {
            dockerArgs = [
                'run', '--name', name,
                '--env', 'POSTGRES_PASSWORD=' + config[0],
                '--env', 'POSTGRES_USER=' + config[1],
                '--env', 'POSTGRES_DB=' + config[2],
                '-p', `${availablePort}:5432`,
                '-d', `postgres:${dbVersion}`
            ];
        } else if (type === "mariadb") {
            dockerArgs = [
                'run', '--name', name,
                '--env', 'MARIADB_PASSWORD=' + config[0],
                '--env', 'MARIADB_USER=' + config[1],
                '--env', 'MARIADB_DATABASE=' + config[2],
                '--env', 'MARIADB_ROOT_PASSWORD=' + config[3],
                '-p', `${availablePort}:3306`,
                '-d', `mariadb:${dbVersion}`
            ];
        } else {
            dockerArgs = [];
        }
        return dockerArgs;
    }

    static async getContainerStorageUsed(containerId: string): Promise<string> {
        try {
            console.log(`Calculating Docker container storage used for container ID: ${containerId}`);
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
                console.log(`Docker container restarted: ${containerId}`);
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
                console.log(`Docker container paused: ${containerId}`);
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
                console.log(`Docker container unpaused: ${containerId}`);
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
}
