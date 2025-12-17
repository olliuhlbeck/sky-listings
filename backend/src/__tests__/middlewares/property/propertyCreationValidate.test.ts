process.env.SECRET = 'my_secret';
import express from 'express';
import request from 'supertest';
import multer from 'multer';
import propertyCreationValidate from '../../../middlewares/property/propertyCreationValidate';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../../../types/AuthenticatedRequest';

const upload = multer();
const app = express();

const userId = 123;
const username = 'test-user';
const token = jwt.sign({ userId, username }, process.env.SECRET);

// Test route using the middleware
app.post(
  '/test-property',
  (req: AuthenticatedRequest, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();
    const token = authHeader.split(' ')[1];
    const payload: any = jwt.verify(token, process.env.SECRET as string);
    req.user = { userId: payload.userId, username: payload.username };
    next();
  },
  upload.array('pictures'),
  propertyCreationValidate,
  (req, res) => {
    res.status(200).json({ message: 'Passed validation' });
  },
);

// Property creation middleware
describe('propertyCreationValidate middleware', () => {
  const validBody = {
    street: '123 Main St',
    city: 'Testville',
    state: 'CA',
    postalCode: '12345',
    country: 'USA',
    price: '100000',
    propertyType: 'House',
    propertyStatus: 'Sale',
    bedrooms: '3',
    bathrooms: '2',
    squareMeters: '120',
    description: 'Nice property',
    additionalInfo: 'Close to school',
  };

  it('should reject when no pictures are provided', async () => {
    const response = await request(app)
      .post('/test-property')
      .set('Authorization', `Bearer ${token}`)
      .field('street', validBody.street)
      .field('city', validBody.city)
      .field('state', validBody.state)
      .field('postalCode', validBody.postalCode)
      .field('country', validBody.country)
      .field('price', validBody.price)
      .field('propertyType', validBody.propertyType)
      .field('propertyStatus', validBody.propertyStatus)
      .field('bedrooms', validBody.bedrooms)
      .field('bathrooms', validBody.bathrooms)
      .field('squareMeters', validBody.squareMeters)
      .field('description', validBody.description)
      .field('additionalInfo', validBody.additionalInfo);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Please provide at least one picture.',
    });
  });

  it('should accept valid input with picture', async () => {
    const response = await request(app)
      .post('/test-property')
      .set('authorization', `Bearer ${token}`)
      .field('street', '123 Main St')
      .field('city', 'Testville')
      .field('state', 'CA')
      .field('postalCode', '12345')
      .field('country', 'USA')
      .field('price', '100000')
      .field('propertyType', 'House')
      .field('propertyStatus', 'Sale')
      .field('bedrooms', '3')
      .field('bathrooms', '2')
      .field('squareMeters', '120')
      .field('description', 'Nice property')
      .field('additionalInfo', 'Close to school')
      .attach('pictures', Buffer.from('dummy image'), 'image.jpg');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Passed validation' });
  });

  it('should reject when userId is missing (no authorization header)', async () => {
    const response = await request(app)
      .post('/test-property')
      .field('street', validBody.street)
      .field('city', validBody.city)
      .field('state', validBody.state)
      .field('country', validBody.country)
      .field('price', validBody.price)
      .field('propertyType', validBody.propertyType)
      .field('propertyStatus', validBody.propertyStatus)
      .field('bedrooms', validBody.bedrooms)
      .field('bathrooms', validBody.bathrooms)
      .field('squareMeters', validBody.squareMeters)
      .field('description', validBody.description)
      .attach('pictures', Buffer.from('dummy image'), 'image.jpg');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized request' });
  });

  it('should reject when optional string field is empty', async () => {
    const response = await request(app)
      .post('/test-property')
      .set('Authorization', `Bearer ${token}`)
      .field('street', validBody.street)
      .field('city', validBody.city)
      .field('state', validBody.state)
      .field('postalCode', '   ') // Invalid optional field
      .field('country', validBody.country)
      .field('price', validBody.price)
      .field('propertyType', validBody.propertyType)
      .field('propertyStatus', validBody.propertyStatus)
      .field('bedrooms', validBody.bedrooms)
      .field('bathrooms', validBody.bathrooms)
      .field('squareMeters', validBody.squareMeters)
      .field('description', validBody.description)
      .attach('pictures', Buffer.from('dummy image'), 'image.jpg');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'postalCode must be a string(not empty) if provided.',
    });
  });

  it('should reject when number field is not a valid number', async () => {
    const response = await request(app)
      .post('/test-property')
      .set('Authorization', `Bearer ${token}`)
      .field('street', validBody.street)
      .field('city', validBody.city)
      .field('state', validBody.state)
      .field('country', validBody.country)
      .field('price', 'not-a-number')
      .field('propertyType', validBody.propertyType)
      .field('propertyStatus', validBody.propertyStatus)
      .field('bedrooms', validBody.bedrooms)
      .field('bathrooms', validBody.bathrooms)
      .field('squareMeters', validBody.squareMeters)
      .field('description', validBody.description)
      .attach('pictures', Buffer.from('dummy image'), 'image.jpg');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'price must be a number.' });
  });

  it('should reject when number field is negative', async () => {
    const response = await request(app)
      .post('/test-property')
      .set('Authorization', `Bearer ${token}`)
      .field('street', validBody.street)
      .field('city', validBody.city)
      .field('state', validBody.state)
      .field('country', validBody.country)
      .field('price', '-100')
      .field('propertyType', validBody.propertyType)
      .field('propertyStatus', validBody.propertyStatus)
      .field('bedrooms', validBody.bedrooms)
      .field('bathrooms', validBody.bathrooms)
      .field('squareMeters', validBody.squareMeters)
      .field('description', validBody.description)
      .attach('pictures', Buffer.from('dummy image'), 'image.jpg');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'price cannot be under 0.' });
  });

  it('should reject when string field exceeds max length', async () => {
    const longDescription = 'a'.repeat(2001); // Exceeds 2000 char limit

    const response = await request(app)
      .post('/test-property')
      .set('Authorization', `Bearer ${token}`)
      .field('street', validBody.street)
      .field('city', validBody.city)
      .field('state', validBody.state)
      .field('country', validBody.country)
      .field('price', validBody.price)
      .field('propertyType', validBody.propertyType)
      .field('propertyStatus', validBody.propertyStatus)
      .field('bedrooms', validBody.bedrooms)
      .field('bathrooms', validBody.bathrooms)
      .field('squareMeters', validBody.squareMeters)
      .field('description', longDescription)
      .attach('pictures', Buffer.from('dummy image'), 'image.jpg');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'description is too long (max 2000 characters).',
    });
  });
});
