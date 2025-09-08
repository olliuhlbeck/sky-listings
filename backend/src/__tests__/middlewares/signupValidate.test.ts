import signupValidate from '../../middlewares/signupAndLogin/signupValidate';
import { Request, Response, NextFunction } from 'express';

// Signup validation middleware
describe('signupValidate middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it('should return 400 if required fields are missing', () => {
    signupValidate(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Email, first name, last name, password and username are all required to sign up.',
    });
  });

  it('should call next if input is valid', () => {
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
});
