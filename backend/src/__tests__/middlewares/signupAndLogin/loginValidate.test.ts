import loginValidate from '../../../middlewares/signupAndLogin/loginValidate';
import { Request, Response, NextFunction } from 'express';

describe('loginValidate middleware', () => {
  const createMocks = () => ({
    req: { body: {} } as Partial<Request>,
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>,
    next: jest.fn() as NextFunction,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if username or password is missing', () => {
    const { req, res, next } = createMocks();
    loginValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Username and password are both needed to login.',
    });
  });

  it('should return 400 if username is too long', () => {
    const { req, res, next } = createMocks();
    req.body = {
      username: 'a'.repeat(51),
      password: 'validPassword',
    };

    loginValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Username must be of type string with maximum length of 50 characters.',
    });
  });

  it('should return 400 if password is too long', () => {
    const { req, res, next } = createMocks();
    req.body = {
      username: 'validUser',
      password: 'a'.repeat(51),
    };

    loginValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Password must be of type string with maximum length of 50 characters.',
    });
  });

  it('should return 400 if username is not a string', () => {
    const { req, res, next } = createMocks();
    req.body = {
      username: 12345,
      password: 'validPassword',
    };

    loginValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Username must be of type string with maximum length of 50 characters.',
    });
  });

  it('should return 400 if password is not a string', () => {
    const { req, res, next } = createMocks();
    req.body = {
      username: 'validUser',
      password: 12345,
    };

    loginValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Password must be of type string with maximum length of 50 characters.',
    });
  });

  it('should call next if input is valid', () => {
    const { req, res, next } = createMocks();
    req.body = {
      username: 'validUser',
      password: 'validPassword',
    };

    loginValidate(req as Request, res as Response, next as NextFunction);
    expect(next).toHaveBeenCalled();
  });
});
