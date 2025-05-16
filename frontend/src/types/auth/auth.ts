export interface AuthContextType {
  user: string | null;
  login: (newToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DecodedToken {
  username: string;
  exp: number;
}
