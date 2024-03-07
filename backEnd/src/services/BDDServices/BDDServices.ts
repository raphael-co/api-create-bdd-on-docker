import { Request, Response } from 'express';
import { randomBytes } from 'crypto';

import genereatePassword from '../../middlewares/bdd/genereatePassword';
import genereateusername from '../../middlewares/bdd/generateUsername';
import Cryptage, { EncryptedData } from '../../middlewares/cryptage/Cryptage';
import { DockerService } from '../DockerService/DockerService';
import { DatabaseService } from '../DatabaseService/DatabaseService';
import HashPassword from '../../middlewares/user/HashPassword';


class BDDServices {

    static test = async (req: Request, res: Response) => {

        res.send({
            success: true,
            message: 'Hello World',
            token: null,
        });
    };

    static async deleteBddwithId(id: number, userid: number) {
        let secretKey: EncryptedData = {
            encrypted: '',
            iv: '',
            tag: ''
        };

        try {
            const [rows] = await DatabaseService.querySecretDatabase(
                `SELECT * FROM secretKey WHERE idBdd = ?`, [id]
            );
            if (rows.length > 0) {
                secretKey = JSON.parse(rows[0].secretKey);
            } else {
                throw new Error('Secret key not found.');
            }
        } catch (error) {
            console.error('Error:', (error as Error).message);
            return {
                ok: "error",
                message: (error as Error).message
            };
        }

        if (typeof process.env.SECRET_KEY === 'undefined') {
            throw new Error('SECRET_KEY is not defined in the environment variables');
        }

        const secretKeyBuffer = Buffer.from(process.env.SECRET_KEY, 'hex');
        const secretKeyDbInfo = Cryptage.decrypt(secretKey, secretKeyBuffer);

        try {
            const [rows] = await DatabaseService.queryDatabase(
                `SELECT * FROM bddInfo WHERE id = ? AND UserId = ?`, [id, userid]
            );

            if (rows.length === 0) {
                throw new Error('Database info not found.');
            }

            const keyBuffer = Buffer.from(JSON.parse(secretKeyDbInfo).data);
            const containerId = Cryptage.decrypt(JSON.parse(rows[0].ContainerId), keyBuffer);

            await DockerService.removeContainer(containerId);

            await DatabaseService.queryDatabase(
                `DELETE FROM bddInfo WHERE id = ? AND UserId = ?`, [id, userid]
            );
            await DatabaseService.querySecretDatabase(
                `DELETE FROM secretKey WHERE idBdd = ?`, [id]
            );
            return {
                ok: "ok",
                data: `La base de données a bien été supprimée`
            };
        } catch (error) {
            console.error('Error:', (error as Error).message);
            return {
                ok: "error",
                message: (error as Error).message
            };
        }
    }

    static async getBddwithId(id: number, userid: number) {
        let secretKey: EncryptedData = {
            encrypted: '',
            iv: '',
            tag: ''
        };

        try {
            const [rows] = await DatabaseService.querySecretDatabase(
                `SELECT * FROM secretKey WHERE idBdd = ?`, [id]
            );

            if (rows.length === 0) throw new Error('Secret key not found.');
            secretKey = JSON.parse(rows[0].secretKey);
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
            console.error('Erreur lors de la récupération des données:', errorMessage);
            return {
                ok: "error",
                message: errorMessage
            };
        }

        if (typeof process.env.SECRET_KEY === 'undefined') {
            throw new Error('SECRET_KEY is not defined in the environment variables');
        }

        const secretKeyBuffer = Buffer.from(process.env.SECRET_KEY, 'hex');
        const secretKeyDbInfo = Cryptage.decrypt(secretKey, secretKeyBuffer);

        try {
            const [rows] = await DatabaseService.queryDatabase(
                `SELECT * FROM bddInfo WHERE id = ? AND UserId = ?`, [id, userid]
            );
            if (rows.length === 0) throw new Error('Database info not found.');

            const keyBuffer = Buffer.from(JSON.parse(secretKeyDbInfo).data);
            const storageRemaining = await DockerService.getContainerStorageUsed(Cryptage.decrypt(JSON.parse(rows[0].ContainerId), keyBuffer));
            const bddRun = await DockerService.isContainerRunning(Cryptage.decrypt(JSON.parse(rows[0].ContainerId), keyBuffer));

            const infobdd = {
                id: rows[0].id,
                Name: Cryptage.decrypt(JSON.parse(rows[0].Name), keyBuffer),
                type: Cryptage.decrypt(JSON.parse(rows[0].Type), keyBuffer),
                DatabaseName: Cryptage.decrypt(JSON.parse(rows[0].DatabaseName), keyBuffer),
                Username: Cryptage.decrypt(JSON.parse(rows[0].Username), keyBuffer),
                Password: Cryptage.decrypt(JSON.parse(rows[0].Password), keyBuffer),
                ContainerId: Cryptage.decrypt(JSON.parse(rows[0].ContainerId), keyBuffer),
                Port: JSON.parse(rows[0].Port),
                Host: Cryptage.decrypt(JSON.parse(rows[0].Host), keyBuffer),
                VersionBdd: Cryptage.decrypt(JSON.parse(rows[0].VersionBdd), keyBuffer),
                StorageRemaining: storageRemaining, // Ajout de l'espace de stockage restant
                bddRun: bddRun,
                createAt: rows[0].Create_at,
                HashAdress : rows[0].HashAdress
            };

            return {
                ok: "ok",
                data: infobdd
            };
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
            console.error('Erreur lors de la récupération des données:', errorMessage);
            return {
                ok: "error",
                message: errorMessage
            };
        }
    }

    static async getAllBdd(userid: number) {
        try {
            const [rows] = await DatabaseService.queryDatabase(
                `SELECT * FROM bddInfo WHERE UserId = ?`, [userid]
            );

            if (rows.length === 0) {
                return {
                    ok: "ok",
                    message: "No databases found for the given user.",
                    data: []
                };
            }

            const bdds = await Promise.all(rows.map(async (row: { id: any; Name: string; Type: string; DatabaseName: string; Username: string; Password: string; ContainerId: string; Port: string; Host: string; VersionBdd: string }) => {
                const [secretRows] = await DatabaseService.querySecretDatabase(
                    `SELECT * FROM secretKey WHERE idBdd = ?`, [row.id]
                );
                if (secretRows.length === 0) {
                    throw new Error(`Secret key not found for database with ID ${row.id}.`);
                }

                const secretKeyData: EncryptedData = JSON.parse(secretRows[0].secretKey);
                if (typeof process.env.SECRET_KEY === 'undefined') {
                    throw new Error('SECRET_KEY is not defined in the environment variables');
                }
                const secretKeyBuffer = Buffer.from(process.env.SECRET_KEY, 'hex');
                const decryptedSecretKey = Cryptage.decrypt(secretKeyData, secretKeyBuffer);

                const keyBuffer = Buffer.from(JSON.parse(decryptedSecretKey).data);
                const storageRemaining = await DockerService.getContainerStorageUsed(Cryptage.decrypt(JSON.parse(row.ContainerId), keyBuffer));
                const bddRun = await DockerService.isContainerRunning(Cryptage.decrypt(JSON.parse(row.ContainerId), keyBuffer));
                return {
                    id: row.id,
                    Name: Cryptage.decrypt(JSON.parse(row.Name), keyBuffer),
                    Type: Cryptage.decrypt(JSON.parse(row.Type), keyBuffer),
                    DatabaseName: Cryptage.decrypt(JSON.parse(row.DatabaseName), keyBuffer),
                    Username: Cryptage.decrypt(JSON.parse(row.Username), keyBuffer),
                    Password: Cryptage.decrypt(JSON.parse(row.Password), keyBuffer),
                    ContainerId: Cryptage.decrypt(JSON.parse(row.ContainerId), keyBuffer),
                    Port: JSON.parse(row.Port),
                    Host: Cryptage.decrypt(JSON.parse(row.Host), keyBuffer),
                    VersionBdd: Cryptage.decrypt(JSON.parse(row.VersionBdd), keyBuffer),
                    createAt: rows[0].Create_at,
                    StorageRemaining: storageRemaining,
                    bddRun: bddRun
                };
            }));

            return {
                ok: "ok",
                data: bdds
            };
        } catch (error) {
            console.error('Error:', error);
            return {
                ok: "error",
                message: error instanceof Error ? error.message : 'An unknown error occurred'
            };
        }
    }


    static createBDD = async (BddData: any, userid: number) => {
        const { name, type, databaseName, versionBdd } = BddData;
        const genereatePasswordString = genereatePassword();
        const generateUsernameString = genereateusername(name, type, databaseName);
        try {

            if (typeof process.env.SECRET_KEY === 'undefined') {
                return {
                    success: false,
                    message: 'SECRET_KEY is not defined in the environment variables',
                    token: null,
                }
            }

            const { success, containerId, port, error } = await DockerService.createContainer(name, type, [genereatePasswordString, generateUsernameString, databaseName, genereatePasswordString], versionBdd);

            if (!success || !containerId || !port) {
                return {
                    success: false,
                    message: error,
                    token: null,
                };
            }

            const secretKey: Buffer = randomBytes(32);
            const iv: Buffer = randomBytes(16);

            const host = `localhost:${port}`;
            const hostHash = await HashPassword.hashPassword(host);

            const dbInfo = {
                Name: name,
                versionBdd: versionBdd,
                Type: type,
                Host: 'localhost',
                Port: port,
                Database: databaseName,
                Username: generateUsernameString,
                Password: genereatePasswordString,
                ContainerId: containerId,
                userid: userid,
                host: host,
                hostHash: hostHash
            };

            const values = [
                userid,
                JSON.stringify(Cryptage.encrypt(dbInfo.Username, secretKey, iv)),
                JSON.stringify(Cryptage.encrypt(dbInfo.Password, secretKey, iv)),
                JSON.stringify(Cryptage.encrypt(dbInfo.Database, secretKey, iv)),
                dbInfo.Port,
                JSON.stringify(Cryptage.encrypt(dbInfo.Host, secretKey, iv)),
                JSON.stringify(Cryptage.encrypt(dbInfo.Type, secretKey, iv)),
                JSON.stringify(Cryptage.encrypt(dbInfo.ContainerId, secretKey, iv)),
                JSON.stringify(Cryptage.encrypt(dbInfo.Name, secretKey, iv)),
                JSON.stringify(Cryptage.encrypt(dbInfo.versionBdd, secretKey, iv)),
                dbInfo.host,
                dbInfo.hostHash
            ];

            const query = `INSERT INTO bddInfo (UserId,Username, Password, DatabaseName, Port, Host, Type, ContainerId, Name,VersionBdd,Address,HashAdress) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`;

            const [insertResults] = await DatabaseService.queryDatabase(query, values);

            let id = insertResults.insertId;

            const secretKeyBuffer = Buffer.from(process.env.SECRET_KEY, 'hex');

            const encryptedSecretKey = JSON.stringify(Cryptage.encrypt(JSON.stringify(secretKey), secretKeyBuffer, iv));

            const querySecret = `INSERT INTO secretKey (idBdd, secretKey) VALUES (?, ?)`;
            const valuesSecret = [id, encryptedSecretKey];

            await DatabaseService.querySecretDatabase(querySecret, valuesSecret);

            return {
                success: true,
                id: id,
                message: dbInfo,
                token: null,
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : String(error),
                token: null,
            };
        }
    }


    static RestartBDD = async (BddData: any, userid: number) => {
        const { bddId } = BddData;


        let secretKey: EncryptedData = {
            encrypted: '',
            iv: '',
            tag: ''
        };

        try {
            const [rows] = await DatabaseService.querySecretDatabase(
                `SELECT * FROM secretKey WHERE idBdd = ?`, [bddId]
            );

            if (rows.length === 0) throw new Error('Secret key not found.');
            secretKey = JSON.parse(rows[0].secretKey);
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
            console.error('Erreur lors de la récupération des données:', errorMessage);
            return {
                ok: "error",
                message: errorMessage
            };
        }

        if (typeof process.env.SECRET_KEY === 'undefined') {
            throw new Error('SECRET_KEY is not defined in the environment variables');
        }

        const secretKeyBuffer = Buffer.from(process.env.SECRET_KEY, 'hex');
        const secretKeyDbInfo = Cryptage.decrypt(secretKey, secretKeyBuffer);

        try {
            const [rows] = await DatabaseService.queryDatabase(
                `SELECT * FROM bddInfo WHERE id = ? AND UserId = ?`, [bddId, userid]
            );
            if (rows.length === 0) throw new Error('Database info not found.');

            const keyBuffer = Buffer.from(JSON.parse(secretKeyDbInfo).data);

            await DockerService.restartContainer(Cryptage.decrypt(JSON.parse(rows[0].ContainerId), keyBuffer));

            const port = await DockerService.getContainerPorts(Cryptage.decrypt(JSON.parse(rows[0].ContainerId), keyBuffer));

            return {
                ok: "ok",
                data: "Database restarted successfully.",
                port: port
            };
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
            console.error('Erreur lors de la récupération des données:', errorMessage);
            return {
                ok: "error",
                message: errorMessage
            };
        }
    }

    static BreakBDD = async (BddData: any, userid: number) => {
        const { bddId, command } = BddData;

        let secretKey: EncryptedData = {
            encrypted: '',
            iv: '',
            tag: ''
        };

        try {
            const [rows] = await DatabaseService.querySecretDatabase(
                `SELECT * FROM secretKey WHERE idBdd = ?`, [bddId]
            );

            if (rows.length === 0) throw new Error('Secret key not found.');
            secretKey = JSON.parse(rows[0].secretKey);
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
            console.error('Erreur lors de la récupération des données:', errorMessage);
            return {
                ok: "error",
                message: errorMessage
            };
        }

        if (typeof process.env.SECRET_KEY === 'undefined') {
            throw new Error('SECRET_KEY is not defined in the environment variables');
        }

        const secretKeyBuffer = Buffer.from(process.env.SECRET_KEY, 'hex');
        const secretKeyDbInfo = Cryptage.decrypt(secretKey, secretKeyBuffer);

        try {
            const [rows] = await DatabaseService.queryDatabase(
                `SELECT * FROM bddInfo WHERE id = ? AND UserId = ?`, [bddId, userid]
            );
            if (rows.length === 0) throw new Error('Database info not found.');

            const keyBuffer = Buffer.from(JSON.parse(secretKeyDbInfo).data);

            if (command === "stop") {
                await DockerService.stopContainer(Cryptage.decrypt(JSON.parse(rows[0].ContainerId), keyBuffer));
                return {
                    ok: "ok",
                    data: "Database stopped successfully.",
                };
            } else if (command === "start") {
                await DockerService.startContainer(Cryptage.decrypt(JSON.parse(rows[0].ContainerId), keyBuffer));
                const port = await DockerService.getContainerPorts(Cryptage.decrypt(JSON.parse(rows[0].ContainerId), keyBuffer));
                return {
                    ok: "ok",
                    data: "Database start successfully.",
                    port: port
                };
            } else {
                return {
                    ok: "error",
                    message: "Command not found.",
                };
            }
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
            console.error('Erreur lors de la récupération des données:', errorMessage);
            return {
                ok: "error",
                message: errorMessage
            };
        }
    }
}

export default BDDServices;