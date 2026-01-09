import { render, screen, waitFor } from '@testing-library/react';
import LoginPage from '../../../pages/LoginPage/LoginPage';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import AuthProvider from '../../../components/AuthComponents/AuthProvider';
import { ActionType } from '../../../types/ActionType';
import userEvent from '@testing-library/user-event';
import { useAuth } from '../../../utils/useAuth';
import { AuthContextType } from '../../../types/auth/auth';

// Mock react-router-dom navigation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock useAuth hook
jest.mock('../../../utils/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Helper to render LoginPage with optional location state
const renderLoginPage = (state?: { action: ActionType }) => {
  const initialEntries = state ? [{ pathname: '/login', state }] : ['/login'];

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <LoginPage />
    </MemoryRouter>,
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      userId: null,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
      token: null,
      loading: false,
      authError: undefined,
      profilePicture: null,
    } as AuthContextType);
  });

  it('should render main container correctly', () => {
    renderLoginPage();

    const mainContainer = screen.getByRole('main');
    expect(mainContainer).toBeInTheDocument();
  });

  it('should initialize with Login action from location state', () => {
    renderLoginPage({ action: ActionType.Login });

    expect(screen.getByLabelText(/Login form/i)).toBeInTheDocument();
  });

  it('should initialize with Sign up action from location state', () => {
    renderLoginPage({ action: ActionType.SignUp });

    expect(screen.getByLabelText(/Sign up form/i)).toBeInTheDocument();
  });

  it('should handle missing location state gracefully', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={[{ pathname: '/login' }]}>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    );

    const mainContainer = screen.getByRole('main');
    expect(mainContainer).toBeInTheDocument();
  });

  it('should render login form with Login heading', () => {
    renderLoginPage({ action: ActionType.Login });

    expect(screen.getByLabelText(/Login form/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: /Login/i }),
    ).toBeInTheDocument();
  });

  it('should render sign up form with Sign Up heading', () => {
    renderLoginPage({ action: ActionType.SignUp });

    expect(screen.getByLabelText(/Sign up form/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: /Sign Up/i }),
    ).toBeInTheDocument();
  });

  it('should pass action state to child components', () => {
    renderLoginPage({ action: ActionType.SignUp });

    expect(screen.getByLabelText(/Sign up form/i)).toBeInTheDocument();
  });

  it('should handle action state changes from LoginForm', async () => {
    const user = userEvent.setup();
    renderLoginPage({ action: ActionType.Login });

    const switchButton = screen.getByRole('button', {
      name: /Create one by clicking here/i,
    });
    await user.click(switchButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/Last name/i)).toBeInTheDocument();
    });
  });

  it('should handle action state change from SignUp back to Login', async () => {
    const user = userEvent.setup();
    renderLoginPage({ action: ActionType.SignUp });

    expect(screen.getByLabelText(/Sign up form/i)).toBeInTheDocument();

    const switchButton = screen.getByRole('button', {
      name: /Switch to login by clicking here/i,
    });
    await user.click(switchButton);

    await waitFor(() => {
      expect(screen.queryByLabelText(/Last name/i)).not.toBeInTheDocument();
    });
  });

  it('should handle invalid action type in location state', () => {
    render(
      <AuthProvider>
        <MemoryRouter
          initialEntries={[
            { pathname: '/login', state: { action: 'InvalidAction' } },
          ]}
        >
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    );

    const mainContainer = screen.getByRole('main');
    expect(mainContainer).toBeInTheDocument();
  });

  it('should update both LoginForm and LoginPageTitle when action changes', async () => {
    const user = userEvent.setup();
    renderLoginPage({ action: ActionType.Login });

    expect(screen.getByLabelText(/Login form/i)).toBeInTheDocument();

    const switchButton = screen.getByRole('button', {
      name: /Create one by clicking here/i,
    });
    await user.click(switchButton);

    await waitFor(() => {
      expect(screen.getByLabelText('Sign Up Form')).toBeInTheDocument();
    });
  });

  it('should persist the selected action after rerender', () => {
    const { rerender } = renderLoginPage({ action: ActionType.SignUp });
    expect(screen.getByLabelText(/Last name/i)).toBeInTheDocument();

    rerender(
      <AuthProvider>
        <MemoryRouter
          initialEntries={[
            { pathname: '/login', state: { action: ActionType.SignUp } },
          ]}
        >
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByLabelText(/Last name/i)).toBeInTheDocument();
  });

  it('should show loading state while checking authentication', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      userId: null,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
      token: null,
      loading: true,
      authError: undefined,
      profilePicture: null,
    } as AuthContextType);
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(
      screen.getByText(/Checking authentication state/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should redirect to home if user is already authenticated', () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    (useAuth as jest.Mock).mockReturnValue({
      user: 'authenticatedUser',
      userId: 123,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      token: 'mock-token',
      loading: false,
      authError: undefined,
      profilePicture: null,
    } as AuthContextType);

    render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });
});
