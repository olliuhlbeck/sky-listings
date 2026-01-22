import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import unknownEndpoint from './middlewares/unknownEndpoint/unknowEndpoint';
import signupRouter from './routers/signupRouter/signupRouter';
import loginRouter from './routers/loginRouter/loginRouter';
import propertyRouter from './routers/propertyRouter/propertyRouter';
import infoRouter from './routers/infoRouter/infoRouter';
import serverWakeUpRouter from './routers/serverWakeUpRouter/serverWakeUpRouter';

const server: Express = express();

const port = process.env.PORT || 3000;

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

server.use(cors(corsOptions));
server.use(express.json());

server.use('/info', infoRouter);
server.use('/login', loginRouter);
server.use('/ping', serverWakeUpRouter);
server.use('/property', propertyRouter);
server.use('/signup', signupRouter);

server.get('/api', (req: Request, res: Response): void => {
  res.json({ message: 'Welcome to backend!' });
});

server.use(unknownEndpoint);

if (process.env.NODE_ENV !== 'test') {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default server;
