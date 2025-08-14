import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import jwt from 'jsonwebtoken';
import { LoginPayload } from '../../types/login-payload';

const AuthenticateRequest = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const JWT_SECRET = process.env.SECRET;
  if (!JWT_SECRET) {
    res
      .status(500)
      .json({ error: 'JWT secret is not defined in environment variables' });
    return;
  }
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized request' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as LoginPayload;
    req.user = {
      userId: decodedToken.userId,
      username: decodedToken.username,
    };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
};

export default AuthenticateRequest;
