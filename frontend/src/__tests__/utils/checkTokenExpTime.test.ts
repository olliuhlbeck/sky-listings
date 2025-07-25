import checkTokenExpTime from '../../utils/checkTokenExpTime';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode');

const mockedJwtDecode = jwtDecode as jest.Mock;

describe('checkTokenExpTime', () => {
  const originalDateNow = Date.now;

  beforeEach(() => {
    jest.clearAllMocks();
    // Set time to stop for consistency
    Date.now = jest.fn(() => 1_000_000_000_000);
  });

  afterAll(() => {
    Date.now = originalDateNow;
  });

  it('returns delay time if token has future expiration', () => {
    mockedJwtDecode.mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 10,
    });

    const result = checkTokenExpTime('Dummy.token');
    expect(result).toBe(10_000);
  });

  it('returns null and logs error if token is invalid', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockedJwtDecode.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const result = checkTokenExpTime('bad.token');
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Token decoding failed:',
      expect.any(Error),
    );
  });
});
