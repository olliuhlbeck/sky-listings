export interface AuthContextType {
  userId: number | null;
  user: string | null;
  login: (newToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DecodedToken {
  userId: number | null;
  username: string;
  exp: number;
}
