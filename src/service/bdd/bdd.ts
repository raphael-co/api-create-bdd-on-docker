import { Request, Response } from 'express';
import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process';
import * as mysql from 'mysql';


import { createCipheriv, createDecipheriv, randomBytes, CipherGCMTypes } from 'crypto';


import genereatePassword from '../../middlewares/bdd/genereatePassword';
import genereateusername from '../../middlewares/bdd/genereateusername';

import connSecret from '../../config/dbSecretConfig';
import databaseConnectionPromise from '../../config/dbConnection';
import databaseSecretKeyConnectionPromise from '../../config/dbSecretConfig';
import Cryptage, { EncryptedData } from '../../middlewares/cryptage/Cryptage';
import { DockerService } from '../docker/DockerService';


class BDDServices {

    static test = async (req: Request, res: Response) => {

        res.send({
            success: true,
            message: 'Hello World',
            token: null,
        });
    };

    static async deleteBddwithId(id: number) {
        const conn = await databaseConnectionPromise; // Attend la connexion
        const connSecret = await databaseSecretKeyConnectionPromise;

        let secretKey: EncryptedData = {
            encrypted: '',
            iv: '',
            tag: ''
        }

        try {
            const [rows, fields]: any = await connSecret.query(
                `SELECT * FROM secretKey WHERE idBdd = ?`, [id]
            );
            secretKey = JSON.parse(rows[0].secretKey);


        } catch (error: any) {
            console.error('Erreur lors de la récupération des données:', error);
            return {
                ok: "error",
                message: error.message
            };
        }

        if (typeof process.env.SECRET_KEY === 'undefined') {
            throw new Error('SECRET_KEY is not defined in the environment variables');
        }

        const secretKeyBuffer = Buffer.from(process.env.SECRET_KEY, 'hex');

        const secretKeyDbInfo = Cryptage.decrypt(secretKey, secretKeyBuffer);

        try {
            const [rows, fields]: any = await conn.query(
                `SELECT * FROM bddInfo WHERE id = ?`, [id]
            );

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
            }

            //# Delete container in docker grace a ça : Cryptage.decrypt(JSON.parse(rows[0].ContainerId), keyBuffer),

            const containerId = Cryptage.decrypt(JSON.parse(rows[0].ContainerId), keyBuffer);

            const deleteDockerContainer = async (containerId: string) => {
                return new Promise((resolve, reject) => {
                    exec(`docker rm -f ${containerId}`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Erreur lors de la suppression du conteneur Docker: ${error}`);
                            return reject(error);
                        }
                        console.log(`Conteneur Docker supprimé: ${containerId}`);
                        resolve(stdout ? stdout : stderr);
                    });
                });
            };

            await connSecret.query(
                `DelETE FROM secretKey WHERE idBdd = ?`, [id]
            );

            await conn.query(
                `DelETE FROM bddInfo WHERE id = ?`, [id]
            );

            await deleteDockerContainer(containerId);

            return {
                ok: "ok",
                data: `la base de données ${infobdd.DatabaseName} a bien été supprimée`
            };
        } catch (error: any) {
            console.error('Erreur lors de la récupération des données:', error);
            return {
                ok: "error",
                message: error.message
            };
        }
    }

    static async getBddwithId(id: number) {
        const conn = await databaseConnectionPromise; // Attend la connexion
        const connSecret = await databaseSecretKeyConnectionPromise;

        let secretKey: EncryptedData = {
            encrypted: '',
            iv: '',
            tag: ''
        }

        try {
            const [rows, fields]: any = await connSecret.query(
                `SELECT * FROM secretKey WHERE idBdd = ?`, [id]
            );
            secretKey = JSON.parse(rows[0].secretKey);


        } catch (error: any) {
            console.error('Erreur lors de la récupération des données:', error);
            return {
                ok: "error",
                message: error.message
            };
        }

        if (typeof process.env.SECRET_KEY === 'undefined') {
            throw new Error('SECRET_KEY is not defined in the environment variables');
        }

        const secretKeyBuffer = Buffer.from(process.env.SECRET_KEY, 'hex');

        const secretKeyDbInfo = Cryptage.decrypt(secretKey, secretKeyBuffer);

        try {
            const [rows, fields]: any = await conn.query(
                `SELECT * FROM bddInfo WHERE id = ?`, [id]
            );

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
            }

            return {
                ok: "ok",
                data: infobdd
            };
        } catch (error: any) {
            console.error('Erreur lors de la récupération des données:', error);
            return {
                ok: "error",
                message: error.message
            };
        }
    }

    static createBDD = async (BddData: any) => {
        const conn = await databaseConnectionPromise; // Attend la connexion
        const connSecret = await databaseSecretKeyConnectionPromise

        const { name, type, databaseName } = BddData;
        const genereatePasswordString = genereatePassword();
        const generateUsernameString = genereateusername(name, type, databaseName);

        let dockerCommand = 'docker';
        let dockerArgs: string[];
        // if (type === "postgres") {
        //     dockerArgs = [
        //         'run', '--name', name,
        //         '--env', 'POSTGRES_PASSWORD=' + genereatePasswordString,
        //         '--env', 'POSTGRES_USER=' + generateUsernameString,
        //         '--env', 'POSTGRES_DB=' + databaseName,
        //         '-p', '5432:5432',
        //         '-d', 'postgres'
        //     ];
        // } else if (type === "mariadb") {
        //     dockerArgs = [
        //         'run', '--name', name,
        //         '--env', 'MARIADB_USER=' + generateUsernameString,
        //         '--env', 'MARIADB_PASSWORD=' + genereatePasswordString,
        //         '--env', 'MARIADB_ROOT_PASSWORD=' + genereatePasswordString,
        //         '--env', 'MARIADB_DATABASE=' + databaseName,
        //         '-p', '3306:3306',
        //         '-d', 'mariadb'
        //     ];
        // }
        // else {
        //     return {
        //         success: false,
        //         message: 'Invalid type specified',
        //         token: null,
        //     };
        // }

        try {
            // const result = await new Promise<string>((resolve, reject) => {
            //     const dockerProcess: ChildProcessWithoutNullStreams = spawn(dockerCommand, dockerArgs);

            //     let stdout = '';
            //     let stderr = '';

            //     dockerProcess.stdout.on('data', (data) => {
            //         stdout += data.toString();
            //     });

            //     dockerProcess.stderr.on('data', (data) => {
            //         stderr += data.toString();
            //     });

            //     dockerProcess.on('close', (code) => {
            //         if (code === 0) {
            //             resolve(stdout.trim());
            //         } else {
            //             reject(`Process exited with code ${code}: ${stderr}`);
            //         }
            //     });

            //     dockerProcess.on('error', (error) => {
            //         reject(`Failed to start process: ${error}`);
            //     });
            // });
            // Informations de connexion

            

            // if (type === "postgres") {
            //     dockerArgs = [
            //         'run', '--name', name,
            //         '--env', 'POSTGRES_PASSWORD=' + genereatePasswordString,
            //         '--env', 'POSTGRES_USER=' + generateUsernameString,
            //         '--env', 'POSTGRES_DB=' + databaseName,
            //         '-p', '5432:5432',
            //         '-d', 'postgres'
            //     ];
            // } else if (type === "mariadb") {
            //     dockerArgs = [
                    // 'run', '--name', name,
                    // '--env', 'MARIADB_PASSWORD=' + genereatePasswordString,
                    // '--env', 'MARIADB_USER=' + generateUsernameString,
                    // '--env', 'MARIADB_DATABASE=' + databaseName,
                    // '--env', 'MARIADB_ROOT_PASSWORD=' + genereatePasswordString,
                    // '-p', '3306:3306',
                    // '-d', 'mariadb'
            //     ];
            // }
            // else {
            //     return {
            //         success: false,
            //         message: 'Invalid type specified',
            //         token: null,
            //     };
            // }
            const result = DockerService.createContainer(name, type, [genereatePasswordString, generateUsernameString, databaseName, genereatePasswordString]);
            const secretKey: Buffer = randomBytes(32); // Clé de 256 bits pour AES-256
            const iv: Buffer = randomBytes(16); // Vecteur d'initialisation



            const dbInfo = {
                Name: name, // Replace with actual value
                Type: type, // Replace with actual value, e.g., "postgres" or "mysql"
                Host: 'localhost', // Assuming the container is accessible locally
                Port: type === "postgres" ? 5432 : 3306, // Default ports for PostgreSQL and MariaDB
                Database: databaseName, // Replace with actual value
                Username: generateUsernameString, // Replace with actual value
                Password: genereatePasswordString, // Replace with actual value
                ContainerId: result // Replace with actual container ID
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

            let id = 0
            try {

                const query = `INSERT INTO bddINfo (Username, Password, DatabaseName, Port, Host, Type, ContainerId, Name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

                // Execute the INSERT operation
                const [insertResults]: any = await conn.execute(query, values,);

                // Use type assertion to access the insertId
                // const insertId = (insertResults as any).insertResults.insertId;

                if (!insertResults && !insertResults.insertId) {
                    console.log('erreur');
                }

                id = insertResults.insertId;
                if (typeof process.env.SECRET_KEY === 'undefined') {
                    throw new Error('SECRET_KEY is not defined in the environment variables');
                }

                const secretKeyBuffer = Buffer.from(process.env.SECRET_KEY, 'hex');
                const encryptedSecretKey = JSON.stringify(Cryptage.encrypt(JSON.stringify(secretKey), secretKeyBuffer, iv));

                const querySecret = `INSERT INTO secretKey (idBdd, secretKey) VALUES (?, ?)`;
                const valuesSecret = [insertResults.insertId, encryptedSecretKey];
                const [insertResultsSecretKey]: any = await connSecret.execute(querySecret, valuesSecret);

                console.log('Data inserted successfully, Insertion ID:', insertResultsSecretKey.insertId);
            } catch (err) {
                console.error('Error inserting data:', err);
            }


            return {
                success: true,
                id: id,
                message: dbInfo,
                token: null,
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : error,
                token: null,
            };
        }
    };


}

export default BDDServices;