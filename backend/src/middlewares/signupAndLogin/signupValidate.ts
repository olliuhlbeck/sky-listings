import { Request, Response, NextFunction } from 'express';

const signupValidate = (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, password, username } = req.body;

  if (!firstName || !lastName || !email || !password || !username) {
    res.status(400).json({
      error:
        'Email, first name, last name, password and username are all required to sign up.',
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

  if (typeof firstName !== 'string' || typeof lastName !== 'string') {
    res.status(400).json({
      error: 'First and last name must be of type string.',
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
