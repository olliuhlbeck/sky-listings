import React from 'react';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../../utils/useAuth';
import AuthContext from '../../context/AuthContext';
import { AuthContextType } from '../../types/auth/auth';

// useAuth
describe('useAuth hook', () => {
  it('throws error if used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });

  it('returns context value when used within AuthProvider', () => {
    const mockContextValue: AuthContextType = {
      user: 'test-user',
      userId: 123,
      isAuthenticated: true,
      token: 'mock-token',
      login: jest.fn(),
      logout: jest.fn(),
    };

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toBe(mockContextValue);
  });
});
