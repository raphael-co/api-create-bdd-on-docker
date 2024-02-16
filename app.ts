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
// const server = http.createServer(app)

// const io = new Server(server, {
//   cors: {
//     origin: '*'
//   }
// }) //in case server and client run on different urls
// http://localhost:4000/img/1679588069188.jpg
// app.use('/img', express.static('images'));

app.use(cors());
app.use(helmet());
// app.use((req, res, next) => {
 
//   next();
// });
app.use(express.json());
// app.use((req: any, res, next) => {
//   req.io = io;
//   return next();
// })


// server.listen(process.env.PORT || 4000);

app.use('/', routes);

app.get('/', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({
      message: 'API is up and running',
    });
  });

app.listen(process.env.PORT || 4000, () => {
  console.log('running socket');
  process.env.PORT ? console.log(`server : http://localhost:${env.PORT}/`) : console.log(`local : http://localhost:4000/`);

});