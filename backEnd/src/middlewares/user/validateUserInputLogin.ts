import { Request, Response, NextFunction } from 'express';
const validateUserInputLogin = (req: Request, res: Response, next: NextFunction) => {
    const { mail, password } = req.body;

    // Simple validation logic
    if (!mail || !password) {
        return res.status(400).send({ message: "All fields are required" });
    }
    next();
};
export default validateUserInputLogin;  