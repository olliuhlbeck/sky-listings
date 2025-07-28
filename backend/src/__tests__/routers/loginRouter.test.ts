import request from 'supertest';
import express from 'express';
import argon2 from 'argon2';
import { generateToken } from '../../utils/generateToken';
import { prismaMock, mockFindUnique } from '../testUtils/prismaMock';

let loginRouter: express.Router;

jest.mock('../../../generated/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock),
}));

jest.mock('argon2', () => ({
  verify: jest.fn(),
}));

jest.mock('../../utils/generateToken', () => ({
  generateToken: jest.fn(),
}));

const mockedArgon2 = argon2 as jest.Mocked<typeof argon2>;
const mockedGenerateToken = generateToken as jest.Mock;

describe('loginRouter POST /login', () => {
  let app: express.Express;

  const validUser = {
    id: 'user123',
    username: 'validuser',
    password: 'hashedpassword',
  };

  beforeEach(async () => {
    jest.resetModules();

    app = express();
    app.use(express.json());

    const module = await import('../../routers/loginRouter/loginRouter');
    loginRouter = module.default;
    app.use('/login', loginRouter);

    jest.clearAllMocks();
    process.env.SECRET = 'testsecret';
  });

  afterEach(() => {
    delete process.env.SECRET;
  });

  it('returns 500 if JWT secret is missing', async () => {
    delete process.env.SECRET;

    const res = await request(app)
      .post('/login')
      .send({ username: 'user', password: 'pass' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: 'JWT secret not found. Try again later.',
    });
  });

  it('returns 401 if user does not exist', async () => {
    mockFindUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/login')
      .send({ username: 'nonexistent', password: 'pass' });

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { username: 'nonexistent' },
    });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: 'Unauthorized login credentials. Please check spelling.',
    });
  });

  it('returns 401 if password is incorrect', async () => {
    mockFindUnique.mockResolvedValue(validUser);
    mockedArgon2.verify.mockResolvedValue(false);

    const res = await request(app)
      .post('/login')
      .send({ username: 'validuser', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: 'Unauthorized login credentials. Please check spelling.',
    });
  });

  it('returns 200 and token on successful login', async () => {
    mockFindUnique.mockResolvedValue(validUser);
    mockedArgon2.verify.mockResolvedValue(true);
    mockedGenerateToken.mockReturnValue('mocked-token');

    const res = await request(app)
      .post('/login')
      .send({ username: 'validuser', password: 'hashedpassword' });

    console.log('RESPONSE STATUS:', res.status);
    console.log('RESPONSE BODY:', res.body);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { username: 'validuser' },
    });
    expect(mockedArgon2.verify).toHaveBeenCalledWith(
      validUser.password,
      'hashedpassword',
    );
    expect(mockedGenerateToken).toHaveBeenCalledWith({
      userId: validUser.id,
      username: validUser.username,
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Succesful login.',
      token: 'mocked-token',
    });
  });

  it('returns 500 on unexpected error', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB is down'));

    const res = await request(app)
      .post('/login')
      .send({ username: 'validuser', password: 'pass' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: 'Something went wrong. Please try again.',
    });
  });
});
