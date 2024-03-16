import pool from "../../config/dbConnection";
import poolSecret from "../../config/dbSecretConfig";

export class DatabaseService {

    static async queryDatabase(query: string, params: any[] = []): Promise<any> {
        const result = await pool.query(query, params);
        const [rows, fields] = result;
        return rows;
    }

    static async querySecretDatabase(query: string, params: any[] = []): Promise<any> {
        const [rows, fields] = await poolSecret.query(query, params);
        return rows; 
    }
}
