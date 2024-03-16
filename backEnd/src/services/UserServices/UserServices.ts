// DockerService.ts
import { exec } from 'child_process';
import { Request, Response } from 'express';
import { DatabaseService } from '../DatabaseService/DatabaseService';
import JsonwebtokenController from '../../middlewares/user/JsonwebtokenController';
import HashPassword from '../../middlewares/user/HashPassword';
import BDDServices from '../BDDServices/BDDServices';


export class UserServices {
    static test = async (req: Request, res: Response) => {
        const newPassword = await HashPassword.hashPassword(req.body.password);
        console.log(newPassword);
        res.send({
            success: true,
            message: newPassword,
            token: null,
        });
    };

    static deleteUser = async (id: number) => {

        try {
            const resultAllBdd = await BDDServices.getAllBdd(id);

            if (resultAllBdd.ok === "ok" && Array.isArray(resultAllBdd.data)) {
                for (const bdd of resultAllBdd.data) {
                    try {
                        const deleteResult = await BDDServices.deleteBddwithId(bdd.id, id);
                        console.log(deleteResult);
                    } catch (error) {
                        console.error('Error deleting BDD with ID:', bdd.id, error);
                    }
                }
            } else {
                console.error('Failed to retrieve BDDs or no BDDs found.');
            }
            const [result] = await DatabaseService.queryDatabase(
                "DELETE FROM `users` WHERE `id` = ?", [id]
            );

            if (result.affectedRows && result.affectedRows > 0) {
                return {
                    success: true,
                    message: "User successfully deleted.",
                }

            } else {
                return {
                    success: false,
                    message: "User not found or could not be deleted.",
                };
            }
        } catch (error) {
            console.error('Error:', error);
            return {
                success: false,
                message: "An error occurred while trying to delete the user.",
            };
        }
    };

    static register = async (userData: any) => {
        let { id, mail, password } = userData;
        const hashedPassword = await HashPassword.hashPassword(password);
        mail = mail.toLowerCase();
        try {
            const result = await DatabaseService.queryDatabase(
                "INSERT INTO `users` (`id`, `mail`, `password`) VALUES (?, ?, ?)", [id, mail, hashedPassword]
            );

            console.log(result);
            
            const token = JsonwebtokenController.generateJwtToken(result.insertId);

            return {
                success: true,
                message: "User successfully registered.",
                userDetails: {
                    id: result.insertId,
                    mail: mail,
                    hashedPassword: hashedPassword 
                },
                token: token,
            };
        } catch (error) {
            console.error('Error:', (error as Error).message);
            return {
                success: false,
                message: (error as Error).message
            };
        }
    };
    static login = async (userData: any) => {
        let { mail, password } = userData;

        console.log(userData);
        console.log(password);
        
        mail = mail.toLowerCase();
        try {
            const [users] = await DatabaseService.queryDatabase(
                "SELECT * FROM `users` WHERE `mail` = ?", [mail]
            );

            console.log(users);
            
            if (users === undefined || users === null) {
                return {
                    success: false,
                    message: "User not found."
                };
            }

            console.log('users :', users);
            
            const user = users;

            console.log(user.password);
            
            const passwordMatch = await HashPassword.comparePassword(password, user.password);

            if (!passwordMatch) {
                return {
                    success: false,
                    message: "User not found."
                };
            }

            const token = JsonwebtokenController.generateJwtToken(user.id);

            return {
                success: true,
                message: "User successfully logged in.",
                userDetails: {
                    id: user.id,
                    mail: user.mail
                },
                token: token
            };
        } catch (error) {
            console.error('Error jwt :', (error as Error).message);
            return {
                success: false,
                message: (error as Error).message
            };
        }
    };
}
