import { prismaMock } from '../../__mocks__/prismaMock';
const mockFindUnique = prismaMock.user.findUnique;
const mockUpdate = prismaMock.user.update;
const mockUserInfoUpdate = prismaMock.userInfo.update;
const mockUserInfoFindUnique = prismaMock.userInfo.findUnique;

jest.mock('../../../../generated/prisma', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => prismaMock),
  };
});

import request from 'supertest';
import express from 'express';

let infoRouter: express.Router;

// Mock the authentication middleware
jest.mock('../../../middlewares/authentication/authenticateRequest', () => {
  return jest.fn((req, res, next) => {
    if (req.headers.authorization === 'valid-token') {
      req.user = { userId: 123 };
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  });
});

// InfoRouter tests
describe('infoRouter', () => {
  const app = express();
  app.use(express.json());

  beforeAll(async () => {
    const module = await import('../../../routers/infoRouter/infoRouter');
    infoRouter = module.default;
    app.use('/info', infoRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Get /getContactInfoForProperty
  describe('GET /getContactInfoForProperty', () => {
    it('returns 400 if userId is missing or invalid', async () => {
      const res = await request(app).get('/info/getContactInfoForProperty');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid userId' });
    });

    it('returns 404 if user is not found', async () => {
      mockFindUnique.mockResolvedValue(null);

      const res = await request(app)
        .get('/info/getContactInfoForProperty')
        .query({ userId: '123' });

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 123 },
        include: { info: true },
      });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'User not found' });
    });

    it('returns 404 if user.info is not found', async () => {
      mockFindUnique.mockResolvedValue({
        id: 123,
        email: 'user@example.com',
        info: null,
      });

      const res = await request(app)
        .get('/info/getContactInfoForProperty')
        .query({ userId: '123' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'UserInfo not found' });
    });

    it('returns 404 if email is missing', async () => {
      mockFindUnique.mockResolvedValue({
        id: 123,
        email: undefined,
        info: {
          phone: '123-456-7890',
          preferredContactDetails: 'phone',
        },
      });

      const res = await request(app)
        .get('/info/getContactInfoForProperty')
        .query({ userId: '123' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'No email found. Please check again' });
    });

    it('returns 404 if preferredContactDetails is missing', async () => {
      mockFindUnique.mockResolvedValue({
        id: 123,
        email: 'user@example.com',
        info: {
          phone: '123-456-7890',
          preferredContactDetails: undefined,
        },
      });

      const res = await request(app)
        .get('/info/getContactInfoForProperty')
        .query({ userId: '123' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        error: 'No preferred contact method found. Please check again',
      });
    });

    it('returns 404 if phone is missing', async () => {
      mockFindUnique.mockResolvedValue({
        id: 123,
        email: 'user@example.com',
        info: {
          phone: undefined,
          preferredContactDetails: 'email',
        },
      });

      const res = await request(app)
        .get('/info/getContactInfoForProperty')
        .query({ userId: '123' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        error: 'No phone number found. Please check again',
      });
    });

    it('returns 200 and contact info on success', async () => {
      mockFindUnique.mockResolvedValue({
        id: 123,
        email: 'user@example.com',
        info: {
          phone: '123-456-7890',
          preferredContactDetails: 'phone',
        },
      });

      const res = await request(app)
        .get('/info/getContactInfoForProperty')
        .query({ userId: '123' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        phoneNumber: '123-456-7890',
        email: 'user@example.com',
        preferredContactMethod: 'phone',
      });
    });

    it('returns 500 on unexpected error', async () => {
      mockFindUnique.mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .get('/info/getContactInfoForProperty')
        .query({ userId: '123' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Error fetching contact info in backend',
      });
    });
  });

  // Get /getAllUserInfo
  describe('GET /getAllUserInfo', () => {
    it('returns 404 if user is not found', async () => {
      mockFindUnique.mockResolvedValue(null);

      const res = await request(app)
        .get('/info/getAllUserInfo')
        .set('Authorization', 'valid-token');

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 123 },
        include: { info: true },
      });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'User not found' });
    });

    it('returns 404 if user.info is not found', async () => {
      mockFindUnique.mockResolvedValue({
        id: 123,
        email: 'user@example.com',
        info: null,
      });

      const res = await request(app)
        .get('/info/getAllUserInfo')
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'UserInfo not found' });
    });

    it('returns 404 if email is missing', async () => {
      mockFindUnique.mockResolvedValue({
        id: 123,
        email: undefined,
        info: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          phone: '123-456-7890',
          preferredContactDetails: 'EMAIL',
        },
      });

      const res = await request(app)
        .get('/info/getAllUserInfo')
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'No email found. Please check again' });
    });

    it('returns 404 if preferredContactDetails is missing', async () => {
      mockFindUnique.mockResolvedValue({
        id: 123,
        email: 'user@example.com',
        info: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          phone: '123-456-7890',
          preferredContactDetails: undefined,
        },
      });

      const res = await request(app)
        .get('/info/getAllUserInfo')
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        error: 'No preferred contact method found. Please check again',
      });
    });

    it('returns 404 if phone is missing', async () => {
      mockFindUnique.mockResolvedValue({
        id: 123,
        email: 'user@example.com',
        info: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          phone: undefined,
          preferredContactDetails: 'EMAIL',
        },
      });

      const res = await request(app)
        .get('/info/getAllUserInfo')
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        error: 'No phone number found. Please check again',
      });
    });

    it('returns 200 and all user info on success', async () => {
      mockFindUnique.mockResolvedValue({
        id: 123,
        email: 'user@example.com',
        info: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          phone: '+35840511333',
          preferredContactDetails: 'EMAIL',
        },
      });

      const res = await request(app)
        .get('/info/getAllUserInfo')
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        address: '123 Main St',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+35840511333',
        email: 'user@example.com',
        preferredContactMethod: 'EMAIL',
      });
    });

    it('returns 500 on unexpected error', async () => {
      mockFindUnique.mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .get('/info/getAllUserInfo')
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Error fetching contact info in backend.',
      });
    });
  });

  // PUT /updateUserInfo
  describe('PUT /updateUserInfo', () => {
    const validUpdateData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'test@test.com',
      phoneNumber: '+358401234567',
      address: '456 Another St',
      preferredContactMethod: 'PHONECALL',
    };

    it('returns 200 and updated info on successful update', async () => {
      mockFindUnique
        .mockResolvedValueOnce({
          id: 123,
          email: 'old@example.com',
          info: { id: 1 },
        })
        .mockResolvedValueOnce(null);

      mockUpdate.mockResolvedValue({
        id: 123,
        email: 'jane@example.com',
      });

      mockUserInfoUpdate.mockResolvedValue({
        id: 1,
        address: '456 New St',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+35840511333',
        preferredContactDetails: 'EMAIL',
      });

      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send(validUpdateData);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        address: '456 New St',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+35840511333',
        email: 'jane@example.com',
        preferredContactMethod: 'EMAIL',
      });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 123 },
        data: { email: 'test@test.com' },
      });

      expect(mockUserInfoUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          address: '456 Another St',
          firstName: 'Jane',
          lastName: 'Doe',
          phone: '+358401234567',
          preferredContactDetails: 'PHONECALL',
        },
      });
    });

    it('returns 400 if request body is invalid', async () => {
      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send({ firstName: 'Jane' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error:
          'Invalid request body. Please provide all required fields with correct types.',
      });
    });

    it('returns 404 if user is not found', async () => {
      mockFindUnique.mockResolvedValue(null);
      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send(validUpdateData);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'User not found' });
    });

    it('returns 404 if userInfo is not found', async () => {
      mockFindUnique.mockResolvedValue({
        id: 123,
        email: 'user@example.com',
        info: null,
      });

      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send(validUpdateData);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'UserInfo not found' });
    });

    it('returns 500 on database error during user lookup', async () => {
      mockFindUnique.mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send(validUpdateData);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error finding user in backend' });
    });

    it('returns 500 on database error during update', async () => {
      mockFindUnique
        .mockResolvedValueOnce({
          id: 123,
          email: 'old@example.com',
          info: { id: 1 },
        })
        .mockResolvedValueOnce(null);

      mockUpdate.mockRejectedValue(new Error('Update error'));

      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send(validUpdateData);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error finding user in backend' });
    });

    it('returns 409 if email is already in use by another user', async () => {
      mockFindUnique
        .mockResolvedValueOnce({
          id: 123,
          email: 'old@example.com',
          info: { id: 1 },
        })
        .mockResolvedValueOnce({
          id: 456,
          email: 'jane@example.com',
        });

      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send(validUpdateData);

      expect(res.status).toBe(409);
      expect(res.body).toEqual({ error: 'Email already in use' });
    });

    it('allows updating with the same email', async () => {
      mockFindUnique
        .mockResolvedValueOnce({
          id: 123,
          email: 'jane@example.com',
          info: { id: 1 },
        })
        .mockResolvedValueOnce({
          id: 123,
          email: 'jane@example.com',
        });

      mockUpdate.mockResolvedValue({
        id: 123,
        email: 'jane@example.com',
      });

      mockUserInfoUpdate.mockResolvedValue({
        id: 1,
        address: '456 New St',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+35840511333',
        preferredContactDetails: 'EMAIL',
      });

      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send(validUpdateData);

      expect(res.status).toBe(200);
      expect(mockFindUnique).toHaveBeenCalledTimes(2);
    });

    it('accepts EMAIL as preferred contact method', async () => {
      mockFindUnique
        .mockResolvedValueOnce({
          id: 123,
          email: 'old@example.com',
          info: { id: 1 },
        })
        .mockResolvedValueOnce(null);

      mockUpdate.mockResolvedValue({
        id: 123,
        email: 'jane@example.com',
      });

      mockUserInfoUpdate.mockResolvedValue({
        id: 1,
        address: '456 New St',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+35840511333',
        preferredContactDetails: 'EMAIL',
      });

      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send({
          ...validUpdateData,
          preferredContactMethod: 'EMAIL',
        });

      expect(res.status).toBe(200);
    });

    it('accepts PHONECALL as preferred contact method', async () => {
      mockFindUnique
        .mockResolvedValueOnce({
          id: 123,
          email: 'old@example.com',
          info: { id: 1 },
        })
        .mockResolvedValueOnce(null);

      mockUpdate.mockResolvedValue({
        id: 123,
        email: 'jane@example.com',
      });

      mockUserInfoUpdate.mockResolvedValue({
        id: 1,
        address: '456 New St',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+35840511333',
        preferredContactDetails: 'PHONECALL',
      });

      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send({
          ...validUpdateData,
          preferredContactMethod: 'PHONECALL',
        });

      expect(res.status).toBe(200);
    });

    it('accepts TEXTMESSAGE as preferred contact method', async () => {
      mockFindUnique
        .mockResolvedValueOnce({
          id: 123,
          email: 'old@example.com',
          info: { id: 1 },
        })
        .mockResolvedValueOnce(null);

      mockUpdate.mockResolvedValue({
        id: 123,
        email: 'jane@example.com',
      });

      mockUserInfoUpdate.mockResolvedValue({
        id: 1,
        address: '456 New St',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+35840511333',
        preferredContactDetails: 'TEXTMESSAGE',
      });

      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send({
          ...validUpdateData,
          preferredContactMethod: 'TEXTMESSAGE',
        });

      expect(res.status).toBe(200);
    });

    it('accepts NOTCHOSEN as preferred contact method', async () => {
      mockFindUnique
        .mockResolvedValueOnce({
          id: 123,
          email: 'old@example.com',
          info: { id: 1 },
        })
        .mockResolvedValueOnce(null);

      mockUpdate.mockResolvedValue({
        id: 123,
        email: 'jane@example.com',
      });

      mockUserInfoUpdate.mockResolvedValue({
        id: 1,
        address: '456 New St',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+35840511333',
        preferredContactDetails: 'NOTCHOSEN',
      });

      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send({
          ...validUpdateData,
          preferredContactMethod: 'NOTCHOSEN',
        });

      expect(res.status).toBe(200);
    });

    it('returns 400 if email format is invalid - missing @', async () => {
      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send({
          ...validUpdateData,
          email: 'invalidemail.com',
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid email format' });
    });

    it('returns 400 if email format is invalid - missing domain', async () => {
      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send({
          ...validUpdateData,
          email: 'invalid@',
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid email format' });
    });

    it('returns 400 if email format is invalid - spaces', async () => {
      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send({
          ...validUpdateData,
          email: 'invalid @example.com',
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid email format' });
    });

    it('returns 400 if phone number format is invalid - letters', async () => {
      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send({
          ...validUpdateData,
          phoneNumber: 'abc123',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid phone number format');
    });

    it('returns 400 if phone number format is invalid - too short', async () => {
      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send({
          ...validUpdateData,
          phoneNumber: '+1',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid phone number format');
    });

    it('returns 400 if email field is missing', async () => {
      const { email, ...dataWithoutEmail } = validUpdateData;
      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send(dataWithoutEmail);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error:
          'Invalid request body. Please provide all required fields with correct types.',
      });
    });

    it('returns 400 if phoneNumber field is missing', async () => {
      const { phoneNumber, ...dataWithoutPhone } = validUpdateData;
      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send(dataWithoutPhone);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error:
          'Invalid request body. Please provide all required fields with correct types.',
      });
    });

    it('returns 400 if preferredContactMethod field is missing', async () => {
      const { preferredContactMethod, ...dataWithoutMethod } = validUpdateData;
      const res = await request(app)
        .put('/info/updateUserInfo')
        .set('Authorization', 'valid-token')
        .send(dataWithoutMethod);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error:
          'Invalid request body. Please provide all required fields with correct types.',
      });
    });
  });

  // GET /getProfilePicture
  describe('GET /getProfilePicture', () => {
    const mockUserInfoFindUnique = prismaMock.userInfo.findUnique;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns 401 if user is not authenticated and no userId provided', async () => {
      const res = await request(app)
        .get('/info/getProfilePicture')
        .set('Authorization', 'invalid-token');

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Unauthorized' });
    });

    it('returns 404 if user info is not found', async () => {
      mockUserInfoFindUnique.mockResolvedValue(null);

      const res = await request(app)
        .get('/info/getProfilePicture')
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'User info not found' });
    });

    it('returns null if user has no profile picture', async () => {
      mockUserInfoFindUnique.mockResolvedValue({
        id: 1,
        profilePicture: null,
        profilePictureMimeType: null,
      });

      const res = await request(app)
        .get('/info/getProfilePicture')
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ profilePicture: null });
    });

    it('returns profile picture as base64 data URI with JPEG mime type', async () => {
      const imageBuffer = Buffer.from('fake jpeg image data');
      mockUserInfoFindUnique.mockResolvedValue({
        id: 1,
        profilePicture: imageBuffer,
        profilePictureMimeType: 'image/jpeg',
      });

      const res = await request(app)
        .get('/info/getProfilePicture')
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(200);
      const expectedBase64 = imageBuffer.toString('base64');
      expect(res.body.profilePicture).toBe(
        `data:image/jpeg;base64,${expectedBase64}`,
      );

      expect(mockUserInfoFindUnique).toHaveBeenCalledWith({
        where: { userId: 123 },
        select: {
          profilePicture: true,
          profilePictureMimeType: true,
        },
      });
    });

    it('returns profile picture as base64 data URI with PNG mime type', async () => {
      const imageBuffer = Buffer.from('fake png image data');
      mockUserInfoFindUnique.mockResolvedValue({
        id: 1,
        profilePicture: imageBuffer,
        profilePictureMimeType: 'image/png',
      });

      const res = await request(app)
        .get('/info/getProfilePicture')
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(200);
      const expectedBase64 = imageBuffer.toString('base64');
      expect(res.body.profilePicture).toBe(
        `data:image/png;base64,${expectedBase64}`,
      );
    });

    it('returns profile picture with default JPEG mime type if not stored', async () => {
      const imageBuffer = Buffer.from('fake image data');
      mockUserInfoFindUnique.mockResolvedValue({
        id: 1,
        profilePicture: imageBuffer,
        profilePictureMimeType: null,
      });

      const res = await request(app)
        .get('/info/getProfilePicture')
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(200);
      const expectedBase64 = imageBuffer.toString('base64');
      expect(res.body.profilePicture).toBe(
        `data:image/jpeg;base64,${expectedBase64}`,
      );
    });

    it('fetches profile picture for specified userId', async () => {
      const imageBuffer = Buffer.from('fake image data');
      mockUserInfoFindUnique.mockResolvedValue({
        id: 1,
        profilePicture: imageBuffer,
        profilePictureMimeType: 'image/jpeg',
      });

      const res = await request(app)
        .get('/info/getProfilePicture')
        .query({ userId: '456' })
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(200);
      expect(mockUserInfoFindUnique).toHaveBeenCalledWith({
        where: { userId: 456 },
        select: {
          profilePicture: true,
          profilePictureMimeType: true,
        },
      });
    });

    it('fetches own profile picture when no userId specified', async () => {
      const imageBuffer = Buffer.from('fake image data');
      mockUserInfoFindUnique.mockResolvedValue({
        id: 1,
        profilePicture: imageBuffer,
        profilePictureMimeType: 'image/jpeg',
      });

      const res = await request(app)
        .get('/info/getProfilePicture')
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(200);
      expect(mockUserInfoFindUnique).toHaveBeenCalledWith({
        where: { userId: 123 },
        select: {
          profilePicture: true,
          profilePictureMimeType: true,
        },
      });
    });

    it('returns 500 on database error', async () => {
      mockUserInfoFindUnique.mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .get('/info/getProfilePicture')
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Error fetching profile picture',
      });
    });
  });

  // PUT /updateProfilePicture
  describe('PUT /updateProfilePicture', () => {
    it('returns 401 if user is not authenticated', async () => {
      const res = await request(app)
        .put('/info/updateProfilePicture')
        .set('Authorization', 'invalid-token');

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Unauthorized' });
    });

    it('returns 400 if no file is uploaded', async () => {
      const res = await request(app)
        .put('/info/updateProfilePicture')
        .set('Authorization', 'valid-token');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'No file uploaded' });
    });

    it('returns 400 if file type is invalid - PDF', async () => {
      mockUserInfoUpdate.mockResolvedValue({});

      const res = await request(app)
        .put('/info/updateProfilePicture')
        .set('Authorization', 'valid-token')
        .attach('profilePicture', Buffer.from('fake pdf content'), {
          filename: 'test.pdf',
          contentType: 'application/pdf',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid file type');
    });

    it('returns 400 if file type is invalid - text file', async () => {
      mockUserInfoUpdate.mockResolvedValue({});

      const res = await request(app)
        .put('/info/updateProfilePicture')
        .set('Authorization', 'valid-token')
        .attach('profilePicture', Buffer.from('fake text content'), {
          filename: 'test.txt',
          contentType: 'text/plain',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid file type');
    });

    it('returns 400 if file type is invalid - executable', async () => {
      mockUserInfoUpdate.mockResolvedValue({});

      const res = await request(app)
        .put('/info/updateProfilePicture')
        .set('Authorization', 'valid-token')
        .attach('profilePicture', Buffer.from('fake exe content'), {
          filename: 'test.exe',
          contentType: 'application/octet-stream',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid file type');
    });

    it('returns 200 and updates profile picture with JPEG', async () => {
      mockUserInfoUpdate.mockResolvedValue({
        id: 1,
        profilePicture: Buffer.from('fake image'),
        profilePictureMimeType: 'image/jpeg',
      });

      const res = await request(app)
        .put('/info/updateProfilePicture')
        .set('Authorization', 'valid-token')
        .attach('profilePicture', Buffer.from('fake jpeg image'), {
          filename: 'profile.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: 'Profile picture updated successfully',
      });

      expect(mockUserInfoUpdate).toHaveBeenCalledWith({
        where: { userId: 123 },
        data: {
          profilePicture: expect.any(Buffer),
          profilePictureMimeType: 'image/jpeg',
        },
      });
    });

    it('returns 200 and updates profile picture with PNG', async () => {
      mockUserInfoUpdate.mockResolvedValue({
        id: 1,
        profilePicture: Buffer.from('fake image'),
        profilePictureMimeType: 'image/png',
      });

      const res = await request(app)
        .put('/info/updateProfilePicture')
        .set('Authorization', 'valid-token')
        .attach('profilePicture', Buffer.from('fake png image'), {
          filename: 'profile.png',
          contentType: 'image/png',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Profile picture updated successfully');

      expect(mockUserInfoUpdate).toHaveBeenCalledWith({
        where: { userId: 123 },
        data: {
          profilePicture: expect.any(Buffer),
          profilePictureMimeType: 'image/png',
        },
      });
    });

    it('returns 200 and updates profile picture with WebP', async () => {
      mockUserInfoUpdate.mockResolvedValue({
        id: 1,
        profilePicture: Buffer.from('fake image'),
        profilePictureMimeType: 'image/webp',
      });

      const res = await request(app)
        .put('/info/updateProfilePicture')
        .set('Authorization', 'valid-token')
        .attach('profilePicture', Buffer.from('fake webp image'), {
          filename: 'profile.webp',
          contentType: 'image/webp',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Profile picture updated successfully');
    });

    it('returns 200 and updates profile picture with GIF', async () => {
      mockUserInfoUpdate.mockResolvedValue({
        id: 1,
        profilePicture: Buffer.from('fake image'),
        profilePictureMimeType: 'image/gif',
      });

      const res = await request(app)
        .put('/info/updateProfilePicture')
        .set('Authorization', 'valid-token')
        .attach('profilePicture', Buffer.from('fake gif image'), {
          filename: 'profile.gif',
          contentType: 'image/gif',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Profile picture updated successfully');
    });

    it('returns 500 on database error', async () => {
      mockUserInfoUpdate.mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .put('/info/updateProfilePicture')
        .set('Authorization', 'valid-token')
        .attach('profilePicture', Buffer.from('fake jpeg image'), {
          filename: 'profile.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Error updating profile picture in backend',
      });
    });
  });
});
