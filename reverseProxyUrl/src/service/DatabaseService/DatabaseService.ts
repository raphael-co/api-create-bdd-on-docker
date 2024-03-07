// DatabaseService.ts

import databaseConnectionPromise from "../../config/dbConnection";


export class DatabaseService {
    static async queryDatabase(query: string, params: any[] = []): Promise<any> {
        const conn = await databaseConnectionPromise;
        return conn.query(query, params);
    }
}
