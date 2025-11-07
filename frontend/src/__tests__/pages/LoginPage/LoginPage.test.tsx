import { render, screen, waitFor } from '@testing-library/react';
import LoginPage from '../../../pages/LoginPage/LoginPage';
import { MemoryRouter } from 'react-router-dom';
import AuthProvider from '../../../components/AuthComponents/AuthProvider';
import { ActionType } from '../../../types/ActionType';
import userEvent from '@testing-library/user-event';

const renderWithRouter = (initialEntries: string[] = ['/login']) => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <LoginPage />
      </MemoryRouter>
    </AuthProvider>,
  );
};

const renderWithLocationState = (state: { action: ActionType }) => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[{ pathname: '/login', state }]}>
        <LoginPage />
      </MemoryRouter>
    </AuthProvider>,
  );
};

describe('LoginPage', () => {
  it('should render main container correctly', () => {
    renderWithRouter();

    const mainContainer = screen.getByTestId('login-page-main-container');
    expect(mainContainer).toBeInTheDocument();
  });

  it('should initialize with Login action from location state', () => {
    renderWithLocationState({ action: ActionType.Login });

    expect(screen.getByLabelText(/Login form/i)).toBeInTheDocument();
  });

  it('should initialize with Sign up action from location state', () => {
    renderWithLocationState({ action: ActionType.SignUp });

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
    renderWithRouter();

    expect(screen.getByLabelText(/Login form/i)).toBeInTheDocument();
    expect(
      screen.getByTestId('title-container-small-screen'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('title-container-large-screen'),
    ).toBeInTheDocument();
  });

  it('should pass action state to child components', () => {
    renderWithLocationState({ action: ActionType.SignUp });

    // Verify the state is passed correctly to children
    expect(screen.getByLabelText(/Sign up form/i)).toBeInTheDocument();
  });

  it('should handle action state changes from LoginForm', async () => {
    const user = userEvent.setup();
    renderWithLocationState({ action: ActionType.Login });

    const switchButton = screen.getByTestId('switch-action-button-container');
    await user.click(switchButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/Last name/i)).toBeInTheDocument();
    });
  });

  it('should handle action state change from SignUp back to Login', async () => {
    const user = userEvent.setup();
    renderWithLocationState({ action: ActionType.SignUp });

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
    renderWithLocationState({ action: ActionType.Login });

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
    const { rerender } = renderWithLocationState({ action: ActionType.SignUp });
    expect(screen.getByLabelText(/Sign up form/i)).toBeInTheDocument();

    rerender(
      <AuthProvider>
        <MemoryRouter initialEntries={[{ pathname: '/login' }]}>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByLabelText(/Sign up form/i)).toBeInTheDocument();
  });
});
