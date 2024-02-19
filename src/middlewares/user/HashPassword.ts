import bcrypt from 'bcrypt';

export interface EncryptedData {
    encrypted: string;
    iv: string;
    tag: string;
}

class HashPassword {

    static hashPassword = (password: string): Promise<string> => {
        const saltRounds = 10;
    
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) {
                    reject(err);
                } else {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(hash);
                        }
                    });
                }
            });
        });
    };

    static comparePassword = (password: string, hash: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };
}

export default HashPassword;