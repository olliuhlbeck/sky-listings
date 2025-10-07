import { prismaMock } from '../__mocks__/prismaMock';
const mockFindUnique = prismaMock.user.findUnique;

jest.mock('../../../generated/prisma', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => prismaMock),
  };
});

import request from 'supertest';
import express from 'express';

let infoRouter: express.Router;

// Mock the authentication middleware
jest.mock('../../middlewares/authentication/authenticateRequest', () => {
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
    const module = await import('../../routers/infoRouter/infoRouter');
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
});
