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

  // Ensures main container div is rendered correctly
  it('renders main container', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );
    const mainDiv = screen.getByRole('main');
    expect(mainDiv).toBeInTheDocument();
  });

  // Verifies layout classes center content
  it('applies correct centering classes', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );
    const mainDiv = screen.getByTestId('home-page-main-container');
    expect(mainDiv).toHaveClass(
      'flex',
      'flex-col',
      'justify-center',
      'items-center',
    );
  });

  // Checks that the hero image is displayed
  it('renders hero section image', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );
    const heroImage = screen.getByAltText('Hero section');
    expect(heroImage).toBeInTheDocument();
  });

  // Confirms ad component is rendered
  it('renders AdComponent with correct props', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );
    const adComponent = screen.getByTestId('ad-component');
    expect(adComponent).toBeInTheDocument();
  });

  // Confirm conditional rendering based on authentication state
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

  // Register button actually redirects to login page
  it('renders Register link pointing to /login', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );

    const registerLink = screen.getByRole('link', { name: /register/i });
    expect(registerLink).toHaveAttribute('href', '/login');
  });
});
