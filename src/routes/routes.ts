import { Router } from 'express';
import bdd from './bdd';
// import photo from '../services/photo';

const routes = Router();

//routes
routes.use('/bdd', bdd);


export default routes;