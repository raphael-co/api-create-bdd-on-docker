import { Request, Response, NextFunction } from 'express';
import { enumTypeBdd } from '../../models/enumTypeBdd';
const validateBddInput = (req: Request, res: Response, next: NextFunction) => {
    const { name, type, databaseName } = req.body;

    const dbNameRegex = /^[a-zA-Z0-9_]+$/;

    // Simple validation logic
    if (!name || !type || !databaseName) {
        return res.status(400).send({ message: "All fields are required" });
    }

    if (!Object.values(enumTypeBdd).includes(type as enumTypeBdd)) {
        return res.status(400).send({ message: `Le type ${type} de bdd n'est pas valide.` });
    }

    if (databaseName.length < 6) {
        return res.status(400).send({ message: "databaseName must be at least 6 characters long" });
    }
    if (!dbNameRegex.test(databaseName)) {
        return res.status(400).send({ message: "le nom de la base de donnée doit contenir uniquement des caractères alphanumériques et des _" });
    } 

    // Check if the email is valid
    // if (!/^[^@]+@\w+(\.\w+)+\w$/.test(email)) {
    //     return res.status(400).send({ message: "Invalid email format" });
    // }

    // Check if the password is strong
    if (name.length < 6) {
        return res.status(400).send({ message: "name must be at least 6 characters long" });
    }

    // If the input passes validation, proceed to the next middleware
    next();
};
export default validateBddInput;  