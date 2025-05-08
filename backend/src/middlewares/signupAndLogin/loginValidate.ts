import { Request, Response, NextFunction } from 'express';

const loginValidate = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      error: 'Username and password are both needed to login.',
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

export default loginValidate;
