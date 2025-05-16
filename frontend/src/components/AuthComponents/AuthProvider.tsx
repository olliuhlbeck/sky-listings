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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const resetTokenState = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authToken');
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      if (decodedToken && decodedToken.exp) {
        const delay = checkTokenExpTime(token);

        if (delay !== null) {
          setUser(decodedToken.username);
          setIsAuthenticated(true);

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
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const logout = (): void => {
    resetTokenState();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
