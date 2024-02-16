import { Request, Response } from 'express';
import { randomBytes } from 'crypto';

import genereatePassword from '../../middlewares/bdd/genereatePassword';
import genereateusername from '../../middlewares/bdd/generateUsername';
import Cryptage, { EncryptedData } from '../../middlewares/cryptage/Cryptage';
import { DockerService } from '../DockerService/DockerService';
import { DatabaseService } from '../DatabaseService/DatabaseService';


class BDDServices {

    static test = async (req: Request, res: Response) => {

        res.send({
            success: true,
            message: 'Hello World',
            token: null,
        });
    };

    static async deleteBddwithId(id: number) {
        let secretKey: EncryptedData = {
            encrypted: '',
            iv: '',
            tag: ''
        };

        try {
            // Retrieve the secret key using DatabaseService
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
            // Retrieve the BDD info using DatabaseService
            const [rows] = await DatabaseService.queryDatabase(
                `SELECT * FROM bddInfo WHERE id = ?`, [id]
            );

            if (rows.length === 0) {
                throw new Error('Database info not found.');
            }

            const keyBuffer = Buffer.from(JSON.parse(secretKeyDbInfo).data);
            const containerId = Cryptage.decrypt(JSON.parse(rows[0].ContainerId), keyBuffer);

            // Delete the Docker container using DockerService
            await DockerService.removeContainer(containerId);

            // Delete entries from databases
            await DatabaseService.querySecretDatabase(
                `DELETE FROM secretKey WHERE idBdd = ?`, [id]
            );
            await DatabaseService.queryDatabase(
                `DELETE FROM bddInfo WHERE id = ?`, [id]
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

    static async getBddwithId(id: number) {
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
                `SELECT * FROM bddInfo WHERE id = ?`, [id]
            );
            if (rows.length === 0) throw new Error('Database info not found.');

            const keyBuffer = Buffer.from(JSON.parse(secretKeyDbInfo).data);

            const infobdd = {
                id: rows[0].id,
                Name: Cryptage.decrypt(JSON.parse(rows[0].Name), keyBuffer),
                type: Cryptage.decrypt(JSON.parse(rows[0].Type), keyBuffer),
                DatabaseName: Cryptage.decrypt(JSON.parse(rows[0].DatabaseName), keyBuffer),
                Username: Cryptage.decrypt(JSON.parse(rows[0].Username), keyBuffer),
                Password: Cryptage.decrypt(JSON.parse(rows[0].Password), keyBuffer),
                ContainerId: Cryptage.decrypt(JSON.parse(rows[0].ContainerId), keyBuffer),
                Port: JSON.parse(rows[0].Port),
                Host: Cryptage.decrypt(JSON.parse(rows[0].Host), keyBuffer)
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

    static createBDD = async (BddData: any) => {
        const { name, type, databaseName } = BddData;
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
            // Assuming createContainer is correctly implemented and returns a promise
            const result = DockerService.createContainer(name, type, [genereatePasswordString, generateUsernameString, databaseName, genereatePasswordString]);

            const secretKey: Buffer = randomBytes(32); // Clé de 256 bits pour AES-256
            const iv: Buffer = randomBytes(16); // Vecteur d'initialisation

            const dbInfo = {
                Name: name,
                Type: type,
                Host: 'localhost',
                Port: type === "postgres" ? 5432 : 3306,
                Database: databaseName,
                Username: generateUsernameString,
                Password: genereatePasswordString,
                ContainerId: result
            };

            const values = [
                JSON.stringify(Cryptage.encrypt(dbInfo.Username, secretKey, iv)),
                JSON.stringify(Cryptage.encrypt(dbInfo.Password, secretKey, iv)),
                JSON.stringify(Cryptage.encrypt(dbInfo.Database, secretKey, iv)),
                dbInfo.Port,
                JSON.stringify(Cryptage.encrypt(dbInfo.Host, secretKey, iv)),
                JSON.stringify(Cryptage.encrypt(dbInfo.Type, secretKey, iv)),
                JSON.stringify(Cryptage.encrypt(await dbInfo.ContainerId, secretKey, iv)),
                JSON.stringify(Cryptage.encrypt(dbInfo.Name, secretKey, iv))
            ];

            const query = `INSERT INTO bddInfo (Username, Password, DatabaseName, Port, Host, Type, ContainerId, Name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

            // Using DatabaseService for the main database operation
            const [insertResults] = await DatabaseService.queryDatabase(query, values);
            let id = insertResults.insertId;

            const secretKeyBuffer = Buffer.from(process.env.SECRET_KEY, 'hex');
            const encryptedSecretKey = JSON.stringify(Cryptage.encrypt(JSON.stringify(secretKey), secretKeyBuffer, iv));

            const querySecret = `INSERT INTO secretKey (idBdd, secretKey) VALUES (?, ?)`;
            const valuesSecret = [id, encryptedSecretKey];

            // Using DatabaseService for the secret database operation
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
}

export default BDDServices;