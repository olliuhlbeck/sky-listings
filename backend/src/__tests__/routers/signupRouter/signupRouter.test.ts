import { prismaMock } from '../../__mocks__/prismaMock';
const mockFindUnique = prismaMock.user.findUnique;
const mockCreate = prismaMock.user.create;

jest.mock('../../../generated/prisma', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => prismaMock),
  };
});

import request from 'supertest';
import express from 'express';
import signupRouter from '../../../routers/signupRouter/signupRouter';
import argon2 from 'argon2';
import * as tokenUtils from '../../../utils/generateToken';

const app = express();
app.use(express.json());
app.use('/signup', signupRouter);

jest
  .spyOn(tokenUtils, 'generateToken')
  .mockImplementation(() => 'mocked-jwt-token');

jest
  .spyOn(argon2, 'hash')
  .mockImplementation(async (password) => `hashed-${password}`);

// POST /signup
describe('POST /signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SECRET = 'supersecret';
  });

  it('returns 500 if JWT secret is missing', async () => {
    delete process.env.SECRET;
    const res = await request(app).post('/signup').send({
      firstName: 'first',
      lastName: 'last',
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('JWT secret not found. Try again later.');
  });

  it('returns 409 if username is already taken', async () => {
    process.env.SECRET = 'supersecret';
    mockFindUnique.mockImplementation(({ where }) => {
      if (where.username === 'testuser')
        return { id: '1', username: 'testuser', email: 'existing@example.com' };
      return null;
    });

    const res = await request(app).post('/signup').send({
      firstName: 'first',
      lastName: 'last',
      email: 'new@example.com',
      username: 'testuser',
      password: 'password123',
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe(
      'Username already taken. Try another username please.',
    );
  });

  it('returns 409 if email is already taken', async () => {
    mockFindUnique.mockImplementation(({ where }) => {
      if (where.username === 'newuser') return null;
      if (where.email === 'taken@example.com')
        return {
          id: '2',
          username: 'existinguser',
          email: 'taken@example.com',
        };
      return null;
    });

    const res = await request(app).post('/signup').send({
      firstName: 'first',
      lastName: 'last',
      email: 'taken@example.com',
      username: 'newuser',
      password: 'password123',
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe(
      'User with email already exists. Try another email please.',
    );
  });

  it('creates a user successfully and returns 201 with token', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      firstName: 'first',
      lastName: 'last',
      id: '123',
      email: 'newuser@example.com',
      username: 'newuser',
    });

    const res = await request(app).post('/signup').send({
      firstName: 'first',
      lastName: 'last',
      email: 'newuser@example.com',
      username: 'newuser',
      password: 'password123',
    });

    expect(mockFindUnique).toHaveBeenCalledTimes(2);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'newuser@example.com',
          username: 'newuser',
          password: expect.stringContaining('hashed-'),
        }),
      }),
    );
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Successful user creation.');
    expect(res.body.user).toEqual({
      id: '123',
      email: 'newuser@example.com',
      username: 'newuser',
    });
    expect(res.body.token).toBe('mocked-jwt-token');
  });

  it('returns 500 if an unexpected error occurs', async () => {
    mockFindUnique.mockImplementation(() => {
      throw new Error('Unexpected DB error');
    });

    const res = await request(app).post('/signup').send({
      firstName: 'first',
      lastName: 'last',
      email: 'fail@example.com',
      username: 'failuser',
      password: 'password123',
    });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Something went wrong. Please try again.');
  });
});
