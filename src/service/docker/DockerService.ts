// DockerService.ts
import { exec } from 'child_process';

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
}
