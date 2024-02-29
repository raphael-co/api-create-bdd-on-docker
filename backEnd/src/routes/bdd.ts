import { Router } from 'express';
import BDDServices from '../services/BDDServices/BDDServices';
import validateBddInput from '../middlewares/bdd/validateBddInput';
import { Request, Response } from 'express';
import JsonWebToken from '../middlewares/JsonWebToken/JsonWebToken';
import JsonwebtokenController from '../middlewares/user/JsonwebtokenController';
import validateDeleteBdd from '../middlewares/bdd/validateDeleteBdd';

const bdd = Router();

bdd.get(
    '/test',
    BDDServices.test,
);

bdd.post('/create', JsonWebToken.ValidToken, validateBddInput, async (req: Request, res: Response) => {
    try {

        const decoded = JsonwebtokenController.verifyJwtToken(req.headers.authorization as string)
        const user = await BDDServices.createBDD(req.body, decoded.decoded.id);
        res.status(201).send({ user });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});

bdd.post('/restart', JsonWebToken.ValidToken, async (req: Request, res: Response) => {
    try {

        const decoded = JsonwebtokenController.verifyJwtToken(req.headers.authorization as string)
        const user = await BDDServices.RestartBDD(req.body, decoded.decoded.id);
        res.status(201).send({ user });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});

bdd.post('/break', JsonWebToken.ValidToken, async (req: Request, res: Response) => {
    try {

        const decoded = JsonwebtokenController.verifyJwtToken(req.headers.authorization as string)
        const user = await BDDServices.BreakBDD(req.body, decoded.decoded.id);
        res.status(201).send({ user });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});


bdd.get('/:id', JsonWebToken.ValidToken, async (req: Request, res: Response) => {
    try {

        const decoded = JsonwebtokenController.verifyJwtToken(req.headers.authorization as string)
        const result = await BDDServices.getBddwithId(Number(req.params.id), decoded.decoded.id);

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

bdd.get('/', JsonWebToken.ValidToken, async (req: Request, res: Response) => {
    try {
        const decoded = JsonwebtokenController.verifyJwtToken(req.headers.authorization as string)
        const result = await BDDServices.getAllBdd(decoded.decoded.id);

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

bdd.post('/delete/:id', JsonWebToken.ValidToken, validateDeleteBdd, async (req: Request, res: Response) => {
    try {
        const decoded = JsonwebtokenController.verifyJwtToken(req.headers.authorization as string)
        const result = await BDDServices.deleteBddwithId(Number(req.params.id), decoded.decoded.id);
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