import { Router } from 'express';
import { Request, Response } from 'express';
import { UrlServices } from '../service/UrlServices';


const url = Router();

url.post('/:url/:bdd', async (req: Request, res: Response) => {
    try {

        const result = await UrlServices.redirect(req.params.url, req.params.bdd);

        if (result.success) {
            res.status(201).send(result);
        } else {
            res.status(400).send(result);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});


export default url;