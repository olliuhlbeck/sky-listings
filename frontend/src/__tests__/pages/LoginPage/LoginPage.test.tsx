import { render, screen, waitFor } from '@testing-library/react';
import LoginPage from '../../../pages/LoginPage/LoginPage';
import { MemoryRouter } from 'react-router-dom';
import AuthProvider from '../../../components/AuthComponents/AuthProvider';
import { ActionType } from '../../../types/ActionType';
import userEvent from '@testing-library/user-event';
import { useAuth } from '../../../utils/useAuth';
import { AuthContextType } from '../../../types/auth/auth';

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
    } as AuthContextType);
  });

  it('should render main container correctly', () => {
    renderLoginPage();

    const mainContainer = screen.getByTestId('login-page-main-container');
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

    const mainContainer = screen.getByTestId('login-page-main-container');
    expect(mainContainer).toBeInTheDocument();
  });

  it('should render login form and title components', () => {
    renderLoginPage();

    expect(screen.getByLabelText(/Login form/i)).toBeInTheDocument();
    expect(
      screen.getByTestId('title-container-small-screen'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('title-container-large-screen'),
    ).toBeInTheDocument();
  });

  it('should pass action state to child components', () => {
    renderLoginPage({ action: ActionType.SignUp });

    // Verify the state is passed correctly to children
    expect(screen.getByLabelText(/Sign up form/i)).toBeInTheDocument();
  });

  it('should handle action state changes from LoginForm', async () => {
    const user = userEvent.setup();
    renderLoginPage({ action: ActionType.Login });

    const switchButton = screen.getByTestId('switch-action-button-container');
    await user.click(switchButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/Last name/i)).toBeInTheDocument();
    });
  });

  it('should handle action state change from SignUp back to Login', async () => {
    const user = userEvent.setup();
    renderLoginPage({ action: ActionType.SignUp });

    expect(screen.getByLabelText(/Sign up form/i)).toBeInTheDocument();

    const switchButton = screen.getByTestId('switch-action-button-container');
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

    const mainContainer = screen.getByTestId('login-page-main-container');
    expect(mainContainer).toBeInTheDocument();
  });

  it('should update both LoginForm and LoginPageTitle when action changes', async () => {
    const user = userEvent.setup();
    renderLoginPage({ action: ActionType.Login });

    expect(
      screen.getByTestId('title-container-large-screen'),
    ).toHaveTextContent(/Login/i);

    const switchButton = screen.getByTestId('switch-action-button-container');
    await user.click(switchButton);

    await waitFor(() => {
      expect(
        screen.getByTestId('title-container-large-screen'),
      ).toHaveTextContent(/Sign up/i);
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
    // Mock useAuth to return loading state
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      userId: null,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
      token: null,
      loading: true,
      authError: undefined,
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
    expect(screen.getByRole('status')).toBeInTheDocument(); // spinner
  });
});
