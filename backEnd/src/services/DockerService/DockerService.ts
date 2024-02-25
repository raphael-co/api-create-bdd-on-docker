// DockerService.ts
import { exec } from 'child_process';
import util from 'util';

const execCallback = util.promisify(exec);

interface Mount {
    Type: string;
    Name: string;
    // Ajoutez d'autres champs au besoin, selon la structure de votre objet Mount
}
export class DockerService {
    static async createContainer(name: string, type: string, config: [string, string, string, string]): Promise<string> {
        let dockerCommand = 'docker';
        let dockerArgs = this.buildDockerArgs(name, type, config);

        return new Promise((resolve, reject) => {
            const dockerProcess = exec(`${dockerCommand} ${dockerArgs.join(' ')}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error creating Docker container: ${error}`);
                    return reject(error);
                }
                resolve(stdout.trim());
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

    private static buildDockerArgs(name: string, type: string, config: [string, string, string, string]): string[] {
        // Implement logic to build docker command arguments based on the type and config
        // This is a placeholder function. You should implement the actual logic.
        let dockerArgs: string[];
        if (type === "postgres") {
            dockerArgs = [
                'run', '--name', name,
                '--env', 'POSTGRES_PASSWORD=' + config[0],
                '--env', 'POSTGRES_USER=' + config[1],
                '--env', 'POSTGRES_DB=' + config[2],
                '-p', '5432:5432',
                '-d', 'postgres'
            ];
        } else if (type === "mariadb") {
            dockerArgs = [
                'run', '--name', name,
                '--env', 'MARIADB_PASSWORD=' +  config[0],
                '--env', 'MARIADB_USER=' +  config[1],
                '--env', 'MARIADB_DATABASE=' +  config[2],
                '--env', 'MARIADB_ROOT_PASSWORD=' +  config[3],
                '-p', '3306:3306',
                '-d', 'mariadb'
            ];
        }else{
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
                // Exécuter un conteneur temporaire pour inspecter l'espace utilisé du volume
                const inspectCommand = `docker run --rm -v ${mount.Name}:/data alpine du -sh /data | cut -f1`;
                const { stdout: sizeOutput } = await execCallback(inspectCommand);
                const sizeWithUnit = sizeOutput.trim();
                // Conversion de la taille avec unité en un nombre en mégaoctets (ou toute autre unité de votre choix)
                const sizeInBytes = this.convertSizeToBytes(sizeWithUnit);
                return sizeInBytes;
            });
    
            const volumeSizes = await Promise.all(volumeSizesPromises);
            // Convertissez la somme totale en l'unité souhaitée, ici pour l'exemple en gigaoctets
            const totalSizeInBytes = volumeSizes.reduce((acc, size) => acc + size, 0);
            const totalSizeInGigabytes = totalSizeInBytes / (1024 * 1024 * 1024);
            return totalSizeInGigabytes.toFixed(2) + ' GB'; // Retournez la taille totale comme une chaîne avec unité
        } catch (error) {
            console.error(`Error calculating Docker container storage used: ${error}`);
            throw error;
        }
    }
    
    // Fonction pour convertir une chaîne de taille avec unité (ex. "46M", "1.2G") en octets
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
        return 0; // Gérer les cas où le format n'est pas reconnu
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
