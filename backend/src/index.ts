import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import unknownEndpoint from './middlewares/unknownEndpoint/unknowEndpoint';
import signupRouter from './routers/signupRouter/signupRouter';
import loginRouter from './routers/loginRouter/loginRouter';
import dotenv from 'dotenv';

dotenv.config();
const server: Express = express();

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const corsOptions = {
  origin: 'http://localhost:5173',
};

server.use(cors(corsOptions));
server.use(express.json());

server.use('/signup', signupRouter);
server.use('/login', loginRouter);

server.get('/api', (req: Request, res: Response): void => {
  res.json({ message: 'Welcome to backend!' });
});

server.use(unknownEndpoint);

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default server;
