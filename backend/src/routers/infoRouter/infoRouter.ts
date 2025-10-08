import express, { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma';
import { GeneralErrorResponse } from '../../types/general-error';
import {
  ContactInfoReturnDto,
  GetContactInfo,
  GetUserInfo,
  UpdateUserInfo,
  UserInfoReturnDto,
} from '../../types/dtos/GetContactInfo.dto';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import AuthenticateRequest from '../../middlewares/authentication/authenticateRequest';

const infoRouter = express.Router();
const prisma = new PrismaClient();

/*
 * Get contact info route
 * -Fetches phone, email and preferred contact method and returns them combined to display
 */
infoRouter.get(
  '/getContactInfoForProperty',
  async (
    req: Request<{}, {}, {}, GetContactInfo>,
    res: Response<ContactInfoReturnDto | GeneralErrorResponse>,
  ): Promise<void> => {
    const userId = parseInt(req.query.userId as string, 10);
    if (!userId || isNaN(userId)) {
      res.status(400).json({ error: 'Invalid userId' });
      return;
    }
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          info: true,
        },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (!user.info) {
        res.status(404).json({ error: 'UserInfo not found' });
        return;
      }

      if (user?.email === undefined) {
        res.status(404).json({ error: 'No email found. Please check again' });
        return;
      }
      if (user.info?.preferredContactDetails === undefined) {
        res.status(404).json({
          error: 'No preferred contact method found. Please check again',
        });
        return;
      }
      if (user.info?.phone === undefined) {
        res.status(404).json({
          error: 'No phone number found. Please check again',
        });
        return;
      }

      const contactInfo: ContactInfoReturnDto = {
        phoneNumber: user.info.phone,
        email: user.email,
        preferredContactMethod: user.info.preferredContactDetails,
      };
      res.status(200).json(contactInfo);
    } catch {
      res.status(500).json({ error: 'Error fetching contact info in backend' });
      return;
    }
  },
);

/*
 * Get all user info route
 * -Fetches first name, last name, phone, email and preferred contact method and returns them combined to display in profile settings page
 */
infoRouter.get(
  '/getAllUserInfo',
  AuthenticateRequest,
  async (
    req: AuthenticatedRequest<{}, {}, {}, GetUserInfo>,
    res: Response<UserInfoReturnDto | GeneralErrorResponse>,
  ): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          info: true,
        },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (!user.info) {
        res.status(404).json({ error: 'UserInfo not found' });
        return;
      }

      if (user?.email === undefined) {
        res.status(404).json({ error: 'No email found. Please check again' });
        return;
      }
      if (user.info?.preferredContactDetails === undefined) {
        res.status(404).json({
          error: 'No preferred contact method found. Please check again',
        });
        return;
      }
      if (user.info?.phone === undefined) {
        res.status(404).json({
          error: 'No phone number found. Please check again',
        });
        return;
      }

      const userInfo: UserInfoReturnDto = {
        address: user.info.address,
        firstName: user.info.firstName,
        lastName: user.info.lastName,
        phoneNumber: user.info.phone,
        email: user.email,
        preferredContactMethod: user.info.preferredContactDetails,
      };
      res.status(200).json(userInfo);
    } catch {
      res
        .status(500)
        .json({ error: 'Error fetching contact info in backend.' });
      return;
    }
  },
);

/*
 * Update user info route
 * --Updates first name, last name, address, phone, email and preferred contact method
 */
infoRouter.put(
  '/updateUserInfo',
  AuthenticateRequest,
  async (
    req: AuthenticatedRequest<{}, {}, UpdateUserInfo>,
    res: Response<UpdateUserInfo | GeneralErrorResponse>,
  ): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const {
      address,
      firstName,
      lastName,
      phoneNumber,
      email,
      preferredContactMethod,
    } = req.body;

    // Validate required fields are present
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !preferredContactMethod
    ) {
      res
        .status(400)
        .json({
          error:
            'Invalid request body. Please provide all required fields with correct types.',
        });
      return;
    }

    // Validate email format (Regex from copilot)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }
    // Validate phone number format (basic check for digits and length (also Regex from copilot))
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      res.status(400).json({
        error:
          'Invalid phone number format. Use phone number format with area code in start (for example in Finland use +35840 511 3313)',
      });
      return;
    }

    // Validate preferred contact method
    const validContactMethods = [
      'EMAIL',
      'PHONECALL',
      'TEXTMESSAGE',
      'NOTCHOSEN',
    ];
    if (!validContactMethods.includes(preferredContactMethod)) {
      res.status(400).json({ error: 'Invalid preferred contact method' });
      return;
    }

    try {
      // Check if user and userInfo exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { info: true },
      });
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      if (!user.info) {
        res.status(404).json({ error: 'UserInfo not found' });
        return;
      }

      // Check if email is being changed to one that already exists
      if (user.email !== email) {
        const emailExists = await prisma.user.findUnique({
          where: { email },
        });
        if (emailExists && emailExists.id !== userId) {
          res.status(409).json({ error: 'Email already in use' });
          return;
        }
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { email },
      });

      // Update userInfo
      const updatedUserInfo = await prisma.userInfo.update({
        where: { id: user.info.id },
        data: {
          address,
          firstName,
          lastName,
          phone: phoneNumber,
          preferredContactDetails: preferredContactMethod,
        },
      });

      const updatedInfo: UpdateUserInfo = {
        address: updatedUserInfo.address || '',
        firstName: updatedUserInfo.firstName,
        lastName: updatedUserInfo.lastName,
        phoneNumber: updatedUserInfo.phone || '',
        email: updatedUser.email,
        preferredContactMethod: updatedUserInfo.preferredContactDetails,
      };
      res.status(200).json(updatedInfo);
    } catch {
      res.status(500).json({ error: 'Error finding user in backend' });
      return;
    }
  },
);

export default infoRouter;
