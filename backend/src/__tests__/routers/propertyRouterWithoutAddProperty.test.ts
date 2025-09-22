process.env.SECRET = 'test-secret';

import { prismaMock } from '../__mocks__/prismaMock';
const mockFindUnique = prismaMock.property.findUnique;
const mockCount = prismaMock.property.count;
const mockFindMany = prismaMock.property.findMany;
const mockUpdate = prismaMock.property.update;

jest.mock('../../../generated/prisma', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => prismaMock),
  };
});

import request from 'supertest';
import express from 'express';
import { TokenPayload } from '../../types/token-payload';
import { generateToken } from '../../utils/generateToken';

let propertyRouter: express.Router;

// Propertyrouter excluding /addProperty endpoint
describe('propertyRouter (excluding /addProperty)', () => {
  const app = express();
  app.use(express.json());

  // generate a valid JWT token for testing
  const tokenPayload: TokenPayload = { userId: 1, username: 'testuser' };
  let validToken: string;

  beforeAll(async () => {
    validToken = generateToken(tokenPayload);

    const module = await import('../../routers/propertyRouter/propertyRouter');
    propertyRouter = module.default;
    app.use('/', propertyRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /getPropertiesByPage
  describe('GET /getPropertiesByPage', () => {
    const mockProperties = [
      {
        id: 1,
        userId: 1,
        street: '123 Main St',
        city: 'Testville',
        state: 'TS',
        country: 'Testland',
        postalCode: '12345',
        price: 100000,
        bedrooms: 3,
        bathrooms: 2,
        squareMeters: 100,
        propertyType: 'HOUSE',
        propertyStatus: 'FOR_SALE',
        description: 'Nice house',
        additionalInfo: 'None',
        createdAt: new Date('2024-01-01'),
        pictures: [
          {
            picture: Buffer.from('fake-image-data'),
            useAsCoverPicture: true,
          },
        ],
      },
    ];

    it('returns paginated properties with base64 images', async () => {
      mockCount.mockResolvedValue(1);
      mockFindMany.mockResolvedValue(mockProperties);

      const res = await request(app).get(
        '/getPropertiesByPage?page=1&pageSize=1',
      );

      expect(mockCount).toHaveBeenCalled();
      expect(mockFindMany).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body.properties[0].coverPicture).toBeDefined();
    });

    it('uses default pagination when missing', async () => {
      mockCount.mockResolvedValue(0);
      mockFindMany.mockResolvedValue([]);

      const res = await request(app).get('/getPropertiesByPage');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ totalCount: 0, properties: [] });
    });

    it('returns 500 on internal error', async () => {
      mockCount.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/getPropertiesByPage');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Failed to load properties. Please try again.',
      });
    });
  });

  // GET /getPropertiesByUserId
  describe('GET /getPropertiesByUserId', () => {
    it('returns user properties for valid userId', async () => {
      mockFindMany.mockResolvedValue([{ id: 1, userId: 5 }]);

      const res = await request(app).get('/getPropertiesByUserId?userId=5');

      expect(mockFindMany).toHaveBeenCalledWith({
        where: { userId: 5 },
      });
      expect(res.status).toBe(200);
      expect(res.body.usersProperties).toHaveLength(1);
    });

    it('returns 500 on internal error', async () => {
      mockFindMany.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/getPropertiesByUserId?userId=5');

      expect(res.status).toBe(500);
      expect(res.body.error).toBe(
        'Failed to load your properties. Please try again.',
      );
    });
  });

  // GET /getAllImagesForProperty
  describe('GET /getAllImagesForProperty', () => {
    it('returns base64 images if property exists', async () => {
      mockFindUnique.mockResolvedValue({
        pictures: [
          { picture: Buffer.from('test-image-1') },
          { picture: Buffer.from('test-image-2') },
        ],
      });

      const res = await request(app).get(
        '/getAllImagesForProperty?propertyId=10',
      );

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 10 },
        select: { pictures: true },
      });

      expect(res.status).toBe(200);
      expect(res.body.pictures).toHaveLength(2);
    });

    it('returns 400 if propertyId is invalid', async () => {
      const res = await request(app).get(
        '/getAllImagesForProperty?propertyId=abc',
      );

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid propertyId given.');
    });

    it('returns 404 if no pictures found', async () => {
      mockFindUnique.mockResolvedValue({ pictures: [] });

      const res = await request(app).get(
        '/getAllImagesForProperty?propertyId=20',
      );

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('No pictures found for this property');
    });

    it('returns 500 on internal error', async () => {
      mockFindUnique.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get(
        '/getAllImagesForProperty?propertyId=20',
      );

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to fetch images. Please try again.');
    });
  });

  // PUT /editPropertyInformation with authentication
  describe('PUT /editPropertyInformation/:propertyId', () => {
    it('updates property and returns 200 when authenticated', async () => {
      mockFindUnique.mockResolvedValue({ userId: 1 });
      mockUpdate.mockResolvedValue({
        id: 1,
        street: 'New St',
        price: 123456,
      });

      const res = await request(app)
        .put('/editPropertyInformation/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ street: 'New St', price: '123456' });

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { userId: true },
      });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { street: 'New St', price: 123456 },
      });

      expect(res.status).toBe(200);
      expect(res.body.updatedProperty.street).toBe('New St');
      expect(res.body.updatedProperty.price).toBe(123456);
    });

    it('returns 400 if propertyId is invalid', async () => {
      const res = await request(app)
        .put('/editPropertyInformation/abc')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ price: '100000' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid property ID provided');
    });

    it('returns 401 if no authentication provided', async () => {
      const res = await request(app)
        .put('/editPropertyInformation/1')
        .send({ price: '100000' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized request');
    });

    it('returns 500 on error during update', async () => {
      mockUpdate.mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .put('/editPropertyInformation/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ price: '100000' });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to update property information');
    });

    it('handles empty body gracefully', async () => {
      const res = await request(app)
        .put('/editPropertyInformation/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('No fields provided to update');
    });
  });
});
