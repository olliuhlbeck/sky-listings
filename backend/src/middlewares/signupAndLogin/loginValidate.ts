import { Request, Response, NextFunction } from 'express';

const loginValidate = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and password are both needed to login.',
    });
  }

  if (typeof username !== 'string' || username.length > 50) {
    return res.status(400).json({
      error:
        'Username must be of type string with maximum length of 50 characters.',
    });
  }

  if (typeof password !== 'string' || password.length > 50) {
    return res.status(400).json({
      error:
        'Password must be of type string with maximum length of 50 characters.',
    });
  }

  next();
};

export default loginValidate;
