export interface UserSignUpSuccess {
  message: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
  token?: string;
  error?: string;
}
