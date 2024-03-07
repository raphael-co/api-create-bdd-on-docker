// DockerService.ts
import { exec } from 'child_process';
import { Request, Response } from 'express';
import { DatabaseService } from './DatabaseService/DatabaseService';
// import { DatabaseService } from '../DatabaseService/DatabaseService';

export class UrlServices {
   
    static redirect = async (UrlHash: string, BddName: string) => {

        try {
            const [rows] = await DatabaseService.queryDatabase(
                `SELECT * FROM bddInfo WHERE HashAdress = ?`, [UrlHash]
            );

            return {
                success: true,
                message:`${rows[0].Address}/${BddName}`
            };
        } catch (error) {
            console.error('Error:', (error as Error).message);
            return {
                success: false,
                message: (error as Error).message
            };
        }
    };
}
