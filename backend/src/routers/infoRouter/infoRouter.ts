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
import multer from 'multer';

const infoRouter = express.Router();
const prisma = new PrismaClient();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB same as frontend
});

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
 * -Updates first name, last name, address, phone, email and preferred contact method
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
      res.status(400).json({
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

/*
 * Update profile picture route
 * -Updates profile picture in database
 */
infoRouter.put(
  '/updateProfilePicture',
  AuthenticateRequest,
  upload.single('profilePicture'),
  async (
    req: AuthenticatedRequest<{}, {}, {}>,
    res: Response<{} | GeneralErrorResponse>,
  ): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    try {
      // Validate file type as image
      if (!req.file.mimetype.startsWith('image/')) {
        res
          .status(400)
          .json({ error: 'Invalid file type. Please upload an image.' });
        return;
      }

      // Update profile picture in userInfo database
      await prisma.userInfo.update({
        where: { userId },
        data: { profilePicture: req.file.buffer },
      });

      // Convert image buffer to Data URI (base64) to send back to frontend
      // so that user can see the updated profile picture immediately
      const base64Image = req.file.buffer.toString('base64');
      const DataUri = `data:${req.file.mimetype};base64,${base64Image}`;

      res.status(200).json({
        message: 'Profile picture updated successfully',
        profilePicture: DataUri,
      });
      return;
    } catch {
      res
        .status(500)
        .json({ error: 'Error updating profile picture in backend' });
      return;
    }
  },
);

// Fetch profile picture route
infoRouter.get(
  '/getProfilePicture',
  AuthenticateRequest,
  async (
    req: AuthenticatedRequest<{}, {}, {}, { userId?: string }>,
    res: Response<{ profilePicture: string | null } | GeneralErrorResponse>,
  ): Promise<void> => {
    const userId = req.query.userId
      ? parseInt(req.query.userId, 10)
      : req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    try {
      const userInfo = await prisma.userInfo.findUnique({
        where: { userId: userId },
        select: { profilePicture: true },
      });

      if (!userInfo) {
        res.status(404).json({ error: 'User info not found' });
        return;
      }

      // Convert bytes to base64 data URI for frontend
      if (userInfo.profilePicture) {
        const base64 = Buffer.from(userInfo.profilePicture).toString('base64');
        const dataUri = `data:image/jpeg;base64,${base64}`;
        res.status(200).json({ profilePicture: dataUri });
      } else {
        res.status(200).json({ profilePicture: null });
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      res.status(500).json({ error: 'Error fetching profile picture' });
      return;
    }
  },
);

export default infoRouter;
