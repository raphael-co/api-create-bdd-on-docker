import { Router } from 'express';
import { Request, Response } from 'express';
import validateUserInput from '../middlewares/user/validateUserInput';
import { UserServices } from '../services/UserServices/UserServices';
import JsonWebToken from '../middlewares/JsonWebToken/JsonWebToken';
import JsonwebtokenController from '../middlewares/user/JsonwebtokenController';
import validateUserInputLogin from '../middlewares/user/validateUserInputLogin';

const user = Router();

user.post('/register', validateUserInput, async (req: Request, res: Response) => {
    try {

        const user = await UserServices.register(req.body);

        if (user.success) {
            res.status(201).send({ user });
        } else {
            res.status(400).send({ user }); 
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});

user.post('/login', validateUserInputLogin, async (req: Request, res: Response) => {
    try {

        const user = await UserServices.login(req.body);

        if (user.success) {
            res.status(201).send({ user });
        } else {
            res.status(400).send({ user }); 
        }
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});

user.delete('/', JsonWebToken.ValidToken, async (req: Request, res: Response) => {
    try {

        const decoded = JsonwebtokenController.verifyJwtToken(req.headers.authorization as string)

        const user = await UserServices.deleteUser(decoded.decoded.id);

        res.status(201).send({ user });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});

user.get(
    '/test',
    UserServices.test,
);



export default user;