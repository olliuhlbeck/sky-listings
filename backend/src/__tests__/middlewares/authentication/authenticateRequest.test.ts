import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Authentication from '../../../middlewares/authentication/authenticateRequest';
import { AuthenticatedRequest } from '../../../types/AuthenticatedRequest';
import { LoginPayload } from '../../../types/login-payload';

jest.mock('jsonwebtoken');

describe('AuthenticateRequest middleware', () => {
  const createMocks = () => ({
    req: { headers: {} } as Partial<AuthenticatedRequest>,
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>,
    next: jest.fn() as NextFunction,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SECRET = 'testsecret';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 401 if authorization header is missing', () => {
    const { req, res, next } = createMocks();
    Authentication(req as AuthenticatedRequest, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized request' });
  });

  it('should return 401 if token is invalid', () => {
    const { req, res, next } = createMocks();
    req.headers = { authorization: 'Bearer invalidtoken' };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    Authentication(req as AuthenticatedRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid or expired token',
    });
  });

  it('should attach user to req and call next for valid token', () => {
    const { req, res, next } = createMocks();
    const payload: LoginPayload = { userId: 1, username: 'testuser' };
    req.headers = { authorization: 'Bearer validtoken' };
    (jwt.verify as jest.Mock).mockReturnValue(payload);

    Authentication(req as AuthenticatedRequest, res as Response, next);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });

  it('should return 500 if JWT secret is missing', () => {
    const { req, res, next } = createMocks();
    process.env.SECRET = '';
    req.headers = { authorization: 'Bearer validtoken' };

    Authentication(req as AuthenticatedRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'JWT secret is not defined in environment variables',
    });
  });
});
