import { Request, Response, NextFunction } from 'express';
import { enumTypeBdd } from '../../models/enumTypeBdd';
const validateUserInput = (req: Request, res: Response, next: NextFunction) => {
    const { mail, password, confirmPassword, tokenAdmin } = req.body;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    // Simple validation logic
    if (!mail || !password || !confirmPassword || !tokenAdmin) {
        return res.status(400).send({ message: "All fields are required" });
    }

    if(tokenAdmin.trim() !== process.env.TOKEN_ADMIN) {
        return res.status(400).send({ message: "Invalid token" });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).send({ message: "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character" });
    }

    if (confirmPassword !== password) {
        return res.status(400).send({ message: "Passwords do not match" });
        
    }
    if (!mailRegex.test(mail)) {
        return res.status(400).send({ message: "Invalid email format" });
    }


    next();
};
export default validateUserInput;  