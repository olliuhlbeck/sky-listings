import express, { Request, Response } from 'express';
import loginValidate from '../../middlewares/signupAndLogin/loginValidate';
import { LoginUserDto } from '../../types/dtos/LoginUser.dto';
import { GeneralErrorResponse } from '../../types/general-error';
import { PrismaClient } from '../../../generated/prisma';
import argon2 from 'argon2';
import { LoginPayload } from '../../types/login-payload';
import { generateToken } from '../../utils/generateToken';
import { UserLoginSuccess } from '../../types/user-login-success';

const loginRouter = express.Router();
const prisma = new PrismaClient();

const UNAUTHORIZED_ERROR: GeneralErrorResponse = {
  error: 'Unauthorized login credentials. Please check spelling.',
};
const SERVER_ERROR: GeneralErrorResponse = {
  error: 'Something went wrong. Please try again.',
};

/*
 * User Login Route
 * -Checks JWT secret
 * -Validates input using `loginValidate`
 * -Checks if user exist and verifies password
 * -Returns JWT token on success
 */
loginRouter.post(
  '/',
  loginValidate,
  async (
    req: Request<{}, {}, LoginUserDto>,
    res: Response<UserLoginSuccess | GeneralErrorResponse>,
  ) => {
    const { username, password } = req.body;
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedPassword = password.trim();

    try {
      const JWT_SECRET = process.env.SECRET;
      if (!JWT_SECRET) {
        const errorResponse: GeneralErrorResponse = {
          error: 'JWT secret not found. Try again later.',
        };
        res.status(500).json(errorResponse);
        return;
      }

      const doesUserNameExist = await prisma.user.findUnique({
        where: { username: normalizedUsername },
      });
      if (!doesUserNameExist) {
        res.status(401).json(UNAUTHORIZED_ERROR);
        return;
      }

      const isPasswordCorrect = await argon2.verify(
        doesUserNameExist.password,
        normalizedPassword,
      );
      if (!isPasswordCorrect) {
        res.status(401).json(UNAUTHORIZED_ERROR);
        return;
      }

      const loginPayload: LoginPayload = {
        userId: doesUserNameExist.id,
        username: doesUserNameExist.username,
      };

      const token = generateToken(loginPayload);

      const successResponse: UserLoginSuccess = {
        message: 'Succesful login.',
        token: token,
      };
      res.status(200).json(successResponse);
      return;
    } catch (error) {
      res.status(500).json(SERVER_ERROR);
      return;
    }
  },
);

export default loginRouter;
