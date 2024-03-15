import { Router } from 'express';
import bdd from './bdd';
import user from './user';
import portsCheck from './portsCheck';
// import photo from '../services/photo';

const routes = Router();

//routes
routes.use('/bdd', bdd);
routes.use('/user', user);
routes.use('/PortsCheck', portsCheck);

export default routes;