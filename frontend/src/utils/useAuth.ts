import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { AuthContextType } from '../types/auth/auth';

// Simplify accessing authentication contect throughout this React app
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
