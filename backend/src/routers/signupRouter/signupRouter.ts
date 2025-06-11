import express, { Request, Response } from 'express';
import signupValidate from '../../middlewares/signupAndLogin/signupValidate';
import { PrismaClient } from '../../../generated/prisma';
import { CreateUserDto } from '../../types/dtos/CreateUser.dto';
import argon2 from 'argon2';
import { UserSignUpSuccess } from '../../types/user-signup-response';
import { GeneralErrorResponse } from '../../types/general-error';
import { TokenPayload } from '../../types/token-payload';
import { generateToken } from '../../utils/generateToken';

const signupRouter = express.Router();
const prisma = new PrismaClient();

/**
 * User Signup Route
 * - Checks JWT secret
 * - Validates input using `signUpValidate`
 * - Checks if username/email is already taken
 * - Hashes password and creates new user
 * - Optionally logs in user by generating JWT
 */
signupRouter.post(
  '/',
  signupValidate,
  async (
    req: Request<{}, {}, CreateUserDto>,
    res: Response<UserSignUpSuccess | GeneralErrorResponse>,
  ) => {
    const { email, username, password } = req.body;
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

      const checkIfUsernameExists = await prisma.user.findUnique({
        where: { username: normalizedUsername },
      });
      if (checkIfUsernameExists) {
        res.status(409).json({
          error: 'Username already taken. Try another username please.',
        });
        return;
      }

      const checkIfEmailIsAvailable = await prisma.user.findUnique({
        where: { email: email },
      });
      if (checkIfEmailIsAvailable) {
        res.status(409).json({
          error: 'User with email already exists. Try another email please.',
        });
        return;
      }
      const hashedPassword = await argon2.hash(normalizedPassword);
      const createNewUser = await prisma.user.create({
        data: {
          email: email,
          username: normalizedUsername,
          password: hashedPassword,
        },
      });

      const successResponse: UserSignUpSuccess = {
        message: 'Successful user creation.',
        user: {
          id: createNewUser.id,
          email: createNewUser.email,
          username: createNewUser.username,
        },
      };

      const tokenPayload: TokenPayload = {
        userId: createNewUser.id,
        username: createNewUser.username,
      };

      const token = generateToken(tokenPayload);
      successResponse.token = token;

      res.status(201).json(successResponse);
      return;
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Something went wrong. Please try again.' });
      return;
    }
  },
);

export default signupRouter;
