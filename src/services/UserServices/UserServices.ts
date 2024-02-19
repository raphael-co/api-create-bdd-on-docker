// DockerService.ts
import { exec } from 'child_process';
import { Request, Response } from 'express';
import HashPassword from '../../middlewares/user/hashPassword';
import { DatabaseService } from '../DatabaseService/DatabaseService';
import JsonwebtokenController from '../../middlewares/user/JsonwebtokenController';


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

    static register = async (userData: any) => {
        const { id, mail, password } = userData;
        const hashedPassword = await HashPassword.hashPassword(password);

        try {
            // Insérer un nouvel utilisateur dans la base de données
            const [rows] = await DatabaseService.queryDatabase(
                "INSERT INTO `users` (`id`, `mail`, `password`) VALUES (?, ?, ?)", [id, mail, hashedPassword]
            );

            // Si l'insertion réussit, `rows` devrait contenir des informations sur l'opération
            // Cette partie dépend de l'implémentation de votre DatabaseService et du système de gestion de base de données utilisé
            // Vous pourriez avoir besoin de vérifier le succès de l'opération d'une manière spécifique

            const token = JsonwebtokenController.generateJwtToken(rows.insertId);

            return {
                success: true,
                message: "User successfully registered.",
                userDetails: {
                    id: rows.insertId,
                    mail: mail,
                    hashedPassword: hashedPassword // Renvoyer le mot de passe haché peut ne pas être sécurisé
                },
                token: token, // Supposons que vous générez un token ailleurs si nécessaire
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
            // Rechercher l'utilisateur par mail
            const [users] = await DatabaseService.queryDatabase(
                "SELECT * FROM `users` WHERE `mail` = ?", [mail]
            );

            if (users.length === 0) {
                return {
                    success: false,
                    message: "User not found."
                };
            }

            // L'utilisateur existe, vérifier le mot de passe
            const user = users[0];
            const passwordMatch = await HashPassword.comparePassword(password, user.password);

            if (!passwordMatch) {
                return {
                    success: false,
                    message: "Invalid password."
                };
            }

            // Le mot de passe est correct, générer un token JWT
            const token = JsonwebtokenController.generateJwtToken(user.id);

            return {
                success: true,
                message: "User successfully logged in.",
                userDetails: {
                    id: user.id,
                    mail: user.mail
                    // Ne renvoyez pas le mot de passe haché pour des raisons de sécurité
                },
                token: token
            };
        } catch (error) {
            console.error('Error:', (error as Error).message);
            return {
                success: false,
                message: (error as Error).message
            };
        }
    };
}
