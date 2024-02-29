import { Request, Response, NextFunction } from 'express';

const validateDeleteBdd = (req: Request, res: Response, next: NextFunction) => {
    const { confirmDelete } = req.body;
    
    if (confirmDelete.trim() !== 'I agree delete this bdd') {
        return res.status(400).send({ message: "the bdd will not be deleted because you did not confirm" });
    }

    next();
};

export default validateDeleteBdd;
