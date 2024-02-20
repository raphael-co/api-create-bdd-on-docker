import { Router } from 'express';
import bdd from './bdd';
import user from './user';
// import photo from '../services/photo';

const routes = Router();

//routes
routes.use('/bdd', bdd);
routes.use('/user', user);


export default routes;