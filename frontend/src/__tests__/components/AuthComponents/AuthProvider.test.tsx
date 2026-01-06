import { jest } from '@jest/globals';
import React from 'react';
import { render, act } from '@testing-library/react';
import AuthContext from '../../../context/AuthContext';
import AuthProvider from '../../../components/AuthComponents/AuthProvider';

// Mock dependencies
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

jest.mock('../../../utils/checkTokenExpTime', () => ({
  __esModule: true,
  default: jest.fn(),
}));

global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

import { jwtDecode as realJwtDecode } from 'jwt-decode';
import checkTokenExpTimeReal from '../../../utils/checkTokenExpTime';

// Cast to mocked function types
const jwtDecode = realJwtDecode as jest.MockedFunction<typeof realJwtDecode>;
const checkTokenExpTime = checkTokenExpTimeReal as jest.MockedFunction<
  typeof checkTokenExpTimeReal
>;

// Helper to get context value
const renderWithAuthContext = (ui?: React.ReactNode) => {
  let ctx!: NonNullable<React.ContextType<typeof AuthContext>>;

  const HookWrapper = () => {
    ctx = React.useContext(AuthContext)!;
    return null;
  };

  render(
    <AuthProvider>
      {ui}
      <HookWrapper />
    </AuthProvider>,
  );

  return () => ctx;
};

// AuthProvider
describe('AuthProvider', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    jest.useFakeTimers();
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes unauthenticated when no token', () => {
    const getContext = renderWithAuthContext();
    const context = getContext();
    expect(context.isAuthenticated).toBe(false);
    expect(context.user).toBeNull();
    expect(context.token).toBeNull();
  });

  it('decodes token and sets authenticated state', () => {
    localStorage.setItem('authToken', 'fakeToken');
    jwtDecode.mockReturnValue({
      exp: Date.now() / 1000 + 60,
      username: 'testuser',
      userId: 42,
    });
    checkTokenExpTime.mockReturnValue(5000);

    const getContext = renderWithAuthContext();
    const context = getContext();

    expect(jwtDecode).toHaveBeenCalledWith('fakeToken');
    expect(context.isAuthenticated).toBe(true);
    expect(context.user).toBe('testuser');
    expect(context.userId).toBe(42);
  });

  it('sets logout timeout and clears auth', () => {
    localStorage.setItem('authToken', 'fakeToken');
    jwtDecode.mockReturnValue({
      exp: Date.now() / 1000 + 60,
      username: 'timeoutuser',
      userId: 1,
    });
    checkTokenExpTime.mockReturnValue(1000);

    const getContext = renderWithAuthContext();
    let context = getContext();
    expect(context.isAuthenticated).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    context = getContext();
    expect(context.isAuthenticated).toBe(false);
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('login stores token and authenticates', () => {
    jwtDecode.mockReturnValue({
      exp: Date.now() / 1000 + 60,
      username: 'loginuser',
      userId: 99,
    });
    checkTokenExpTime.mockReturnValue(9999);

    const getContext = renderWithAuthContext();
    let context = getContext();

    act(() => {
      context.login('newToken');
    });

    context = getContext();
    expect(localStorage.getItem('authToken')).toBe('newToken');
    expect(context.isAuthenticated).toBe(true);
    expect(context.user).toBe('loginuser');
    expect(context.userId).toBe(99);
  });

  it('logout clears state and localStorage', () => {
    jwtDecode.mockReturnValue({
      exp: Date.now() / 1000 + 60,
      username: 'someuser',
      userId: 5,
    });
    checkTokenExpTime.mockReturnValue(9999);

    const getContext = renderWithAuthContext();
    let context = getContext();

    // Authenticate
    act(() => {
      context.login('fakeToken');
    });

    context = getContext();
    expect(context.isAuthenticated).toBe(true);

    // Logout
    act(() => {
      context.logout();
    });

    context = getContext();
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(context.isAuthenticated).toBe(false);
    expect(context.user).toBeNull();
    expect(context.userId).toBeNull();
  });
});
