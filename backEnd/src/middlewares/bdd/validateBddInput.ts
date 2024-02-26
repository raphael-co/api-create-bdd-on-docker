import { Request, Response, NextFunction } from 'express';
import { enumTypeBdd } from '../../models/enumTypeBdd';
import JsonwebtokenController from '../user/JsonwebtokenController';

const validDbVersions = {
    postgres: ['16', '15', '14', "13", "12"],
    mariadb: ['10.5', '10.6', '10.7', '10.4', '10.10', '10.11', '10.8', '10.9'],
};

const validateBddInput = (req: Request, res: Response, next: NextFunction) => {
    const { name, type, databaseName, versionBdd } = req.body; // Ajouté : dbVersion

    const dbNameRegex = /^[a-zA-Z0-9_]+$/;

    // Validation de base
    if (!name || !type || !databaseName || !versionBdd) {
        return res.status(400).send({ message: "All fields including dbVersion are required" });
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

    if (name.length < 6) {
        return res.status(400).send({ message: "name must be at least 6 characters long" });
    }

    // Ajouté : Vérification de la version de la BDD
    const validVersions = validDbVersions[type as keyof typeof validDbVersions];

    if (!validVersions || !validVersions.includes(versionBdd)) {
        return res.status(400).send({ message: `La version ${versionBdd} n'est pas valide pour le type ${type}` });
    }

    // Si l'entrée passe la validation, procéder au middleware suivant
    next();
};

export default validateBddInput;
