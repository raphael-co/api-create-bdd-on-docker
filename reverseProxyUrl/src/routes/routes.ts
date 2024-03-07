import { Router } from 'express';
import url from './url';

// import photo from '../services/photo';

const routes = Router();

//routes
routes.use('/url', url);


export default routes;