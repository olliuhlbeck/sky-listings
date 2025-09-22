process.env.SECRET = 'test-secret';

import { prismaMock } from '../__mocks__/prismaMock';
const mockDeleteProperty = prismaMock.property.delete;
const mockDeletePictures = prismaMock.propertyPicture.deleteMany;
const mockFindUnique = prismaMock.property.findUnique;

import request from 'supertest';
import express from 'express';
import { generateToken } from '../../utils/generateToken';
import { TokenPayload } from '../../types/token-payload';

jest.mock('../../../generated/prisma', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => prismaMock),
  };
});

let propertyRouter: express.Router;

describe('DELETE /delete/:propertyId', () => {
  const app = express();
  app.use(express.json());

  let validToken: string;
  const tokenPayload: TokenPayload = { userId: 1, username: 'testuser' };

  beforeAll(async () => {
    validToken = generateToken(tokenPayload);

    const module = await import('../../routers/propertyRouter/propertyRouter');
    propertyRouter = module.default;
    app.use('/', propertyRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes property successfully', async () => {
    mockFindUnique.mockResolvedValue({ userId: 1 });
    mockDeletePictures.mockResolvedValue({ count: 1 });
    mockDeleteProperty.mockResolvedValue({ id: 1 });

    const res = await request(app)
      .delete('/delete/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect(mockDeletePictures).toHaveBeenCalledWith({
      where: { propertyId: 1 },
    });
    expect(mockDeleteProperty).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Property deleted successfully');
  });

  it('returns 400 if propertyId is invalid', async () => {
    const res = await request(app)
      .delete('/delete/abc')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid property ID provided');
    expect(mockDeletePictures).not.toHaveBeenCalled();
    expect(mockDeleteProperty).not.toHaveBeenCalled();
  });

  it('returns 401 if no token is provided', async () => {
    const res = await request(app).delete('/delete/1');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized request');
  });

  it('returns 403 if user does not own the property', async () => {
    mockFindUnique.mockResolvedValue({ userId: 2 });

    const res = await request(app)
      .delete('/delete/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Unauthorized to delete this property');
    expect(mockDeletePictures).not.toHaveBeenCalled();
    expect(mockDeleteProperty).not.toHaveBeenCalled();
  });

  it('returns 404 if property does not exist', async () => {
    mockFindUnique.mockResolvedValue(null);

    const res = await request(app)
      .delete('/delete/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Property not found');
    expect(mockDeletePictures).not.toHaveBeenCalled();
    expect(mockDeleteProperty).not.toHaveBeenCalled();
  });
});
