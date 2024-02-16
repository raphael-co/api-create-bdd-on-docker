import { Router } from 'express';
import BDDServices from '../service/bdd/bdd';
import validateBddInput from '../middlewares/bdd/validateBddInput';
import { Request, Response } from 'express';

const bdd = Router();

bdd.get(
    '/test',
    BDDServices.test,
);

bdd.post('/create', validateBddInput, async (req: Request, res: Response) => {
    try {
        const user = await BDDServices.createBDD(req.body);
        res.status(201).send({ user });
    } catch (error: unknown) {
        // Check if the error is an instance of Error
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            // If the error is not an Error object, handle it as a generic error
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});

bdd.get('/:id', async (req: Request, res: Response) => {
    try {
        // Assuming BDDServices.getBddwithId correctly returns the data as an array or object
        const result = await BDDServices.getBddwithId(Number(req.params.id));
        // Assuming result is an array of objects, directly send the first item
        // Adjust this line if your data structure is different
        const user = Array.isArray(result) ? result[0] : result;
        res.status(201).send({ user: user });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});

bdd.delete('/:id', async (req: Request, res: Response) => {
    try {
        // Assuming BDDServices.getBddwithId correctly returns the data as an array or object
        const result = await BDDServices.deleteBddwithId(Number(req.params.id));
        // Assuming result is an array of objects, directly send the first item
        // Adjust this line if your data structure is different
        const user = Array.isArray(result) ? result[0] : result;
        res.status(201).send({ user: user });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});

export default bdd;