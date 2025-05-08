import { Request, Response, NextFunction } from 'express';

const signupValidate = (req: Request, res: Response, next: NextFunction) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    res.status(400).json({
      error: 'Email, username and password are all required to sign up.',
    });
    return;
  }

  if (typeof email !== 'string' || email.length > 50) {
    res.status(400).json({
      error:
        'Email must be of type string with maximum length of 50 characters.',
    });
    return;
  }

  if (typeof username !== 'string' || username.length > 50) {
    res.status(400).json({
      error:
        'Username must be of type string with maximum length of 50 characters.',
    });
    return;
  }

  if (typeof password !== 'string' || password.length > 50) {
    res.status(400).json({
      error:
        'Password must be of type string with maximum length of 50 characters.',
    });
    return;
  }

  next();
};

export default signupValidate;
