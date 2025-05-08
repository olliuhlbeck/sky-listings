import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/token-payload';

export function generateToken(payload: TokenPayload): string {
  const JWT_SECRET = process.env.SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT secret not found.');
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}
