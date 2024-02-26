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
        const { id, mail, password } = userData;
        const hashedPassword = await HashPassword.hashPassword(password);

        try {
            const [rows] = await DatabaseService.queryDatabase(
                "INSERT INTO `users` (`id`, `mail`, `password`) VALUES (?, ?, ?)", [id, mail, hashedPassword]
            );

            const token = JsonwebtokenController.generateJwtToken(rows.insertId);

            return {
                success: true,
                message: "User successfully registered.",
                userDetails: {
                    id: rows.insertId,
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
        const { mail, password } = userData;

        try {
            const [users] = await DatabaseService.queryDatabase(
                "SELECT * FROM `users` WHERE `mail` = ?", [mail]
            );

            if (users.length === 0) {
                return {
                    success: false,
                    message: "User not found."
                };
            }

            const user = users[0];
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
