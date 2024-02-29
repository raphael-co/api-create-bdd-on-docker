import { Request, Response, NextFunction } from 'express';
import JsonwebtokenController from '../user/JsonwebtokenController';

export interface EncryptedData {
    encrypted: string;
    iv: string;
    tag: string;
}

class JsonWebToken {

    static ValidToken(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;
            if (authHeader == null) {
                return res.status(401).send({ message: "Token is required" });
            }

            // Vérifier le token JWT
            const verificationResult = JsonwebtokenController.verifyJwtToken(authHeader);
            if (!verificationResult.valid) {
                return res.status(401).send({ message: verificationResult.error || "Invalid token" });
            }

            const userId : any = verificationResult.decoded.id;
            if (userId == null) {
                return res.status(401).send({ message: "Invalid token" });
            }

            next()

        } catch (error) {
            return res.status(401).send({ message: "Error when check the token" });
        }
    }

}

export default JsonWebToken;