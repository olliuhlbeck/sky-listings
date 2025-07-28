process.env.SECRET = 'my_secret';
import express from 'express';
import request from 'supertest';
import multer from 'multer';
import propertyCreationValidate from '../../middlewares/property/propertyCreationValidate';
import jwt from 'jsonwebtoken';

const upload = multer();
const app = express();

const userId = 123;
const token = jwt.sign({ userId }, process.env.SECRET);

app.use(express.json());

// Test route using the middleware
app.post(
  '/test-property',
  upload.array('pictures'), // Simulate file uploads
  propertyCreationValidate,
  (req, res) => {
    res.status(200).json({ message: 'Passed validation' });
  },
);

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
      .field('additionalInfo', validBody.additionalInfo)
      .attach('pictures', Buffer.from('dummy image'), 'image.jpg'); // Simulate image

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Passed validation',
    });
  });
});
