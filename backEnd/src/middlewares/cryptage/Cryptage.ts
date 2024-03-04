import { createCipheriv, createDecipheriv, CipherGCMTypes } from 'crypto';

export interface EncryptedData {
    encrypted: string;
    iv: string;
    tag: string;
}

class Cryptage {
    static encrypt(text: string | Buffer, secretKey: Buffer, iv: Buffer): EncryptedData {

        console.log(secretKey);
        
        const cipher = createCipheriv('aes-256-gcm' as CipherGCMTypes, secretKey, iv);
        let encrypted: string;
        
        // Gère les deux types possibles pour `text`
        if (typeof text === 'string') {
            // Si `text` est une chaîne, utilisez l'encodage 'utf8' pour les données d'entrée
            encrypted = cipher.update(text, 'utf8', 'hex');
        } else {
            // Si `text` est un Buffer, pas besoin de spécifier l'encodage d'entrée
            encrypted = cipher.update(text, undefined, 'hex');
        }

        encrypted += cipher.final('hex');
        const tag = cipher.getAuthTag().toString('hex');
        return { encrypted, iv: iv.toString('hex'), tag }; // Renvoie l'objet crypté, l'IV et le tag d'authentification
    }
    static decrypt(encryptedObj: EncryptedData, secretKey: Buffer): string {
        const decipher = createDecipheriv('aes-256-gcm' as CipherGCMTypes, secretKey, Buffer.from(encryptedObj.iv, 'hex'));
        decipher.setAuthTag(Buffer.from(encryptedObj.tag, 'hex'));
        let decrypted = decipher.update(encryptedObj.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted; // Renvoie la chaîne décryptée
    }
}

export default Cryptage;