import { createContext } from 'react';
import { AuthContextType } from '../types/auth/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
