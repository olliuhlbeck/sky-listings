import { ReactNode, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../types/auth/auth';
import checkTokenExpTime from '../../utils/checkTokenExpTime';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('authToken'),
  );
  const [user, setUser] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const resetTokenState = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserId(null);
    localStorage.removeItem('authToken');
    setToken(null);
  };

  const fetchProfilePicture = async (userIdToFetch: number) => {
    try {
      const BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${BASE_URL}/info/getProfilePicture?userId=${userIdToFetch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setProfilePicture(data.profilePicture);
      }
    } catch (error) {
      console.error('Failed to fetch profile picture:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (token) {
          const decodedToken = jwtDecode<DecodedToken>(token);
          if (decodedToken && decodedToken.exp) {
            const delay = checkTokenExpTime(token);

            if (delay !== null) {
              setUser(decodedToken.username);
              setUserId(decodedToken.userId);
              setIsAuthenticated(true);
              setAuthError(undefined);

              if (typeof decodedToken.userId === 'number') {
                fetchProfilePicture(decodedToken.userId);
              }

              // Auto logout when token expires
              const timeoutId = setTimeout(() => {
                resetTokenState();
              }, delay);

              return () => clearTimeout(timeoutId);
            } else {
              resetTokenState();
            }
          }
        } else {
          resetTokenState();
        }
      } catch {
        setAuthError('Failed to initialize authentication.');
        resetTokenState();
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const logout = (): void => {
    resetTokenState();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        login,
        logout,
        isAuthenticated,
        token,
        loading,
        authError,
        profilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
