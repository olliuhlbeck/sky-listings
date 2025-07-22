import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import unknownEndpoint from './middlewares/unknownEndpoint/unknowEndpoint';
import signupRouter from './routers/signupRouter/signupRouter';
import loginRouter from './routers/loginRouter/loginRouter';
import propertyRouter from './routers/propertyRouter/propertyRouter';
import contactInfoRouter from './routers/contactInfoRouter/contactInfoRouter';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.SECRET;
if (!secret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
const server: Express = express();

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

server.use(cors(corsOptions));
server.use(express.json());

server.use('/signup', signupRouter);
server.use('/login', loginRouter);
server.use('/property', propertyRouter);
server.use('/contactInfo', contactInfoRouter);

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
