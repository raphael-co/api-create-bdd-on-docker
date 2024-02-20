var jwt = require('jsonwebtoken');

class JsonwebtokenController {
    static generateJwtToken(userId: number) {
        const secretKey = process.env.JWT_SECRET_KEY;
        const options = { expiresIn: '1h' };

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
}

export default JsonwebtokenController;