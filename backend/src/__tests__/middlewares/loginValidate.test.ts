import loginValidate from '../../middlewares/signupAndLogin/loginValidate';
import { Request, Response, NextFunction } from 'express';

describe('loginValidate middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 400 if username or password is missing', () => {
    loginValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Username and password are both needed to login.',
    });
  });

  it('should return 400 if username is too long', () => {
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
    req.body = {
      username: 'validUser',
      password: 'validPassword',
    };

    loginValidate(req as Request, res as Response, next as NextFunction);
    expect(next).toHaveBeenCalled();
  });
});
