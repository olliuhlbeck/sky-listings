import { describe } from 'node:test';
import { generateToken } from '../../utils/generateToken';
import jwt from 'jsonwebtoken';

describe('generateToken', () => {
  const mockSecret = 'testSecret';

  beforeAll(() => {
    process.env.SECRET = mockSecret;
  });

  it('should generate a valid JWT token.', () => {
    const payload = { userId: 360, username: 'testuser' };
    const token = generateToken(payload);
    const decoded = jwt.verify(token, mockSecret);
    expect((decoded as any).userId).toBe(payload.userId);
    expect((decoded as any).username).toBe(payload.username);
  });

  it('should throw if JWT secret is missing', () => {
    delete process.env.SECRET;
    expect(() => generateToken({ userId: 1, username: 'fail' })).toThrow(
      'JWT secret not found',
    );
  });
});
