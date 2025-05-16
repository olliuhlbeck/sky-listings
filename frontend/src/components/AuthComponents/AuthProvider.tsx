import { ReactNode, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  username: string;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      if (typeof decodedToken === 'object' && decodedToken !== null) {
        setUser(decodedToken.username);
        setIsAuthenticated(true);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const logout = (): void => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
