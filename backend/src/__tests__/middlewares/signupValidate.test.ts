import signupValidate from '../../middlewares/signupAndLogin/signupValidate';
import { Request, Response, NextFunction } from 'express';

describe('signupValidate middleware', () => {
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

  it('should return 400 if required fields are missing', () => {
    const { req, res, next } = createMocks();
    signupValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Email, first name, last name, password and username are all required to sign up.',
    });
  });

  it('should call next if input is valid', () => {
    const { req, res, next } = createMocks();
    req.body = {
      firstName: 'first',
      lastName: 'last',
      email: 'test@test.com',
      username: 'testuser',
      password: 'pass',
    };
    signupValidate(req as Request, res as Response, next as NextFunction);
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if username exceeds 50 characters', () => {
    const { req, res, next } = createMocks();
    req.body = {
      firstName: 'first',
      lastName: 'last',
      email: 'test@test.com',
      username: 'a'.repeat(51),
      password: 'pass',
    };
    signupValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Username must be of type string with maximum length of 50 characters.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if email exceeds 50 characters', () => {
    const { req, res, next } = createMocks();
    req.body = {
      firstName: 'first',
      lastName: 'last',
      email: 'a'.repeat(51) + '@test.com',
      username: 'testuser',
      password: 'pass',
    };
    signupValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Email must be of type string with maximum length of 50 characters.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if email is not a string', () => {
    const { req, res, next } = createMocks();
    req.body = {
      firstName: 'first',
      lastName: 'last',
      email: 123,
      username: 'testuser',
      password: 'pass',
    };
    signupValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Email must be of type string with maximum length of 50 characters.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if password is not a string', () => {
    const { req, res, next } = createMocks();
    req.body = {
      firstName: 'first',
      lastName: 'last',
      email: 'test@test.com',
      username: 'testuser',
      password: 123,
    };
    signupValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Password must be of type string with maximum length of 50 characters.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if username is not a string', () => {
    const { req, res, next } = createMocks();
    req.body = {
      firstName: 'first',
      lastName: 'last',
      email: 'test@test.com',
      username: 123,
      password: 'pass',
    };
    signupValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Username must be of type string with maximum length of 50 characters.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if lastName is not a string', () => {
    const { req, res, next } = createMocks();
    req.body = {
      firstName: 'first',
      lastName: 123,
      email: 'test@test.com',
      username: 'testuser',
      password: 'pass',
    };
    signupValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'First and last name must be of type string.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if firstName is not a string', () => {
    const { req, res, next } = createMocks();
    req.body = {
      firstName: 123,
      lastName: 'last',
      email: 'test@test.com',
      username: 'testuser',
      password: 'pass',
    };
    signupValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'First and last name must be of type string.',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
