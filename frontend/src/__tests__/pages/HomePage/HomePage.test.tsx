import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../../utils/useAuth');

import HomePage from '../../../pages/HomePage/HomePage';
import { useAuth } from '../../../utils/useAuth';

// Cast to mocked function
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set default mock return value
    mockUseAuth.mockReturnValue({
      user: null,
      userId: null,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
      token: null,
      loading: false,
    });
  });

  it('renders main container', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );
    const mainDiv = screen.getByRole('main');
    expect(mainDiv).toBeInTheDocument();
  });

  it('renders hero section image', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );
    const heroImage = screen.getByAltText('Hero section');
    expect(heroImage).toBeInTheDocument();
  });

  it('renders AdComponent with  "Apply loan" button', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );
    const adComponent = screen.getByText('Apply for loan');
    expect(adComponent).toBeInTheDocument();
  });

  it('renders the sell property button when user is logged in', () => {
    mockUseAuth.mockReturnValue({
      user: 'Alice',
      userId: 123,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      token: 'fake-token',
      loading: false,
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );

    const sellPropertyCard = screen.getByText(/Sell properties/i);
    expect(sellPropertyCard).toBeInTheDocument();
  });

  it('renders Register link which actually redirects to /login', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );

    const registerLink = screen.getByRole('link', { name: /register/i });
    expect(registerLink).toHaveAttribute('href', '/login');
  });
});
