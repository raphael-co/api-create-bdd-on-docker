import { DatabaseService } from "../../services/DatabaseService/DatabaseService";

var jwt = require('jsonwebtoken');

class JsonwebtokenController {
    static generateJwtToken(userId: number) {
        const secretKey = process.env.JWT_SECRET_KEY;
        const options = { expiresIn: '10h' };

        const token = jwt.sign({ id: userId }, secretKey, options);

        return token;
    }

    static verifyJwtToken(token: string) {
        const secretKey = process.env.JWT_SECRET_KEY;
        try {
            const tokenNoBearer = token.split(' ')[1]
            const decoded = jwt.verify(tokenNoBearer, secretKey);
            return { valid: true, decoded };
        } catch (error) {
            console.error((error as Error).message);
            return { valid: false, error: (error as Error).message };
        }
    }

    static async verifyJwtTokenAdmin(token: string) {
        const secretKey = process.env.JWT_SECRET_KEY;
        try {
            const tokenNoBearer = token.split(' ')[1]
            const decoded = jwt.verify(tokenNoBearer, secretKey);
            const id = decoded['id'];

            const [users] = await DatabaseService.queryDatabase(
                "SELECT * FROM `users` WHERE `id` = ?", [id]
            );

            if (users[0].length === 0) {
                return {
                    valid: false,
                    message: "User not found."
                };
            }
            if (users[0].role !== 'admin') {
                return {
                    valid: false,
                    message: "no admin rights"
                };
            }

            return { valid: true, decoded };
        } catch (error) {
            console.error((error as Error).message);
            return { valid: false, error: (error as Error).message };
        }
    }
}

export default JsonwebtokenController;