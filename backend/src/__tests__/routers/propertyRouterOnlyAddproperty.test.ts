process.env.SECRET = 'my-secret';
import request from 'supertest';
import express from 'express';
import { prismaMock } from '../__mocks__/prismaMock';

jest.mock('../../../generated/prisma', () => {
  const actual = jest.requireActual('../../../generated/prisma');
  return {
    ...actual,
    PrismaClient: jest.fn().mockImplementation(() => prismaMock),
  };
});

import { generateToken } from '../../utils/generateToken';
import { PropertyStatus, PropertyTypes } from '../../../generated/prisma';
import path from 'path';

const app = express();
let propertyRouter: express.Router;

// PropertyRouter tests (only /addProperty)
describe('propertyRouter (only /addProperty)', () => {
  app.use(express.json());

  beforeAll(async () => {
    const module = await import('../../routers/propertyRouter/propertyRouter');
    propertyRouter = module.default;
    app.use('/', propertyRouter);
  });

  // POST /addProperty
  describe('POST /addProperty', () => {
    it('returns 201 and success message on property creation', async () => {
      prismaMock.property.create.mockResolvedValue({
        id: 1,
        userId: 1,
        bedrooms: 2,
        bathrooms: 1,
        additionalInfo: 'Nice place',
        propertyType: 'APARTMENT',
        description: 'Test property',
        city: 'CityX',
        country: 'CountryX',
        postalCode: '12345',
        price: 500000,
        propertyStatus: 'AVAILABLE',
        squareMeters: 100,
        state: 'StateX',
        street: '123 Main St',
        createdAt: new Date(),
      });

      prismaMock.propertyPicture.create.mockResolvedValue({});

      const token = generateToken({ userId: 1, username: 'user' });

      const imagePath = path.resolve(__dirname, '../__mocks__/test-image.jpg');

      const res = await request(app)
        .post('/addProperty')
        .set('Authorization', `Bearer ${token}`)
        .field('street', '123 Main St')
        .field('city', 'CityX')
        .field('state', 'StateX')
        .field('country', 'CountryX')
        .field('postalCode', '12345')
        .field('price', '500000')
        .field('propertyStatus', PropertyStatus.AVAILABLE)
        .field('bedrooms', '2')
        .field('bathrooms', '1')
        .field('squareMeters', '100')
        .field('description', 'Test property')
        .field('propertyType', PropertyTypes.APARTMENT)
        .field('additionalInfo', 'Nice place')
        .attach('pictures', imagePath);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe(
        'Property and its pictures stored successfully',
      );
    });
  });
});
