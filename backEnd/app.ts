import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from "dotenv"
import routes from './src/routes/routes';

dotenv.config()

const env: any = process.env

console.log(env.PORT);
console.log(`Ready on ${env.NODE_ENV} mode`)

const app: Application = express();

// Configuration CORS pour autoriser votre front-end
const corsOptions = {
  origin: ['http://192.168.1.196:8080', 'http://raphael.netgraph.fr', 'https://raphael.netgraph.fr'], // Ajoutez également la version HTTPS si nécessaire
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Assurez-vous d'inclure 'OPTIONS' pour les requêtes preflight
  credentials: true, // Cela est nécessaire pour les cookies de session côté client
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/', routes);

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: 'API is up and running',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
