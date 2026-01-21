import express, { Request, Response } from 'express';

const serverWakeUpRouter = express.Router();

serverWakeUpRouter.get('/', (req: Request, res: Response) => {
  res.status(204).json({
    status: 'ok',
    message: 'Server is awake',
    timestamp: new Date().toISOString(),
  });
});

export default serverWakeUpRouter;
