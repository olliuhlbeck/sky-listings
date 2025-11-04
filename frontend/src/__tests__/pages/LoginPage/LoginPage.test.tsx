import { render, screen } from '@testing-library/react';
import LoginPage from '../../../pages/LoginPage/LoginPage';
import { MemoryRouter } from 'react-router-dom';
import AuthProvider from '../../../components/AuthComponents/AuthProvider';
import { ActionType } from '../../../types/ActionType';

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
});
