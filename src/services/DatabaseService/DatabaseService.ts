// DatabaseService.ts
import databaseConnectionPromise from "../../config/dbConnection";
import databaseSecretKeyConnectionPromise from "../../config/dbSecretConfig";


export class DatabaseService {
    static async queryDatabase(query: string, params: any[] = []): Promise<any> {
        const conn = await databaseConnectionPromise;
        return conn.query(query, params);
    }

    static async querySecretDatabase(query: string, params: any[] = []): Promise<any> {
        const conn = await databaseSecretKeyConnectionPromise;
        return conn.query(query, params);
    }

    // Add more database operations as needed
}
