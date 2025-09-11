import express, { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma';
import { GeneralErrorResponse } from '../../types/general-error';
import {
  ContactInfoReturnDto,
  GetContactInfo,
  GetUserInfo,
  UserInfoReturnDto,
} from '../../types/dtos/GetContactInfo.dto';

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
  async (
    req: Request<{}, {}, {}, GetUserInfo>,
    res: Response<UserInfoReturnDto | GeneralErrorResponse>,
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

export default infoRouter;
