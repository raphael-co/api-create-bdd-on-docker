import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from "dotenv"
import routes from './src/routes/routes';
// import * as http from 'http';
// import { Server } from "socket.io";

dotenv.config()

const env: any = process.env


console.log(env.PORT);

console.log(`Ready on ${env.NODE_ENV} mode`)//express
const app: Application = express();

app.use(cors({
  origin: ['http://192.168.1.196:8080','http://raphael.netgraph.fr'], // Assurez-vous que le port correspond au port de votre front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
}));

app.use(helmet());

app.use(express.json());

app.use('/', routes);

app.get('/', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({
      message: 'API is up and running',
    });
  });

app.listen(process.env.PORT || 3000, () => {
  console.log('running socket');
  process.env.PORT ? console.log(`server : http://localhost:${env.PORT}/`) : console.log(`local : http://localhost:4000/`);

});
