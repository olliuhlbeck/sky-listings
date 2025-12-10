import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../../../components/LoginComponents/LoginForm';
import { ActionType } from '../../../types/ActionType';
import * as useAuthModule from '../../../utils/useAuth';
import userEvent from '@testing-library/user-event';

// Mock the useAuth hook
jest.mock('../../../utils/useAuth');

// Mock react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Wrapper component for router context
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginForm', () => {
  const mockSetAction = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthModule.useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
  });

  it('renders login form with username and password fields', () => {
    renderWithRouter(
      <LoginForm action={ActionType.Login} setAction={mockSetAction} />,
    );

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders signup form with all required fields', () => {
    renderWithRouter(
      <LoginForm action={ActionType.SignUp} setAction={mockSetAction} />,
    );

    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('shows validation errors when submitting login form with invalid data', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <LoginForm action={ActionType.Login} setAction={mockSetAction} />,
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');

    await user.type(usernameInput, 'a');
    await user.type(passwordInput, '123');

    const submitButton = screen.getByRole('button', { name: 'Login' });
    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Min. length 6 characters.')).toBeInTheDocument();
    });
  });

  it('shows email validation error for invalid email in signup', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <LoginForm action={ActionType.SignUp} setAction={mockSetAction} />,
    );

    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'invalid-email');
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: 'Sign Up' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email.'),
      ).toBeInTheDocument();
    });
  });

  it('switches between login and signup modes', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <LoginForm action={ActionType.Login} setAction={mockSetAction} />,
    );

    const switchButton = screen.getByText('Create one by clicking here');
    await user.click(switchButton);

    expect(mockSetAction).toHaveBeenCalledWith(ActionType.SignUp);
  });
});
