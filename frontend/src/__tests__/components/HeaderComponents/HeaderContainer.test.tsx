import { MemoryRouter } from 'react-router-dom';
import { HeaderContainerProps } from '../../../types/HeaderContainerProps';
import HeaderContainer from '../../../components/HeaderComponents/HeaderContainer';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAuth } from '../../../utils/useAuth';

// mock useAuth globally for tests
jest.mock('../../../utils/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Render helper function
const renderHeaderContainer = (props: Partial<HeaderContainerProps> = {}) => {
  const defaultProps: HeaderContainerProps = {
    title: 'Test Title',
    link: '/home',
    isHamburgerMenuOpen: false,
    setIsHamburgerMenuOpen: jest.fn(),
    ...props,
  };

  return render(
    <MemoryRouter initialEntries={['/']}>
      <HeaderContainer {...defaultProps} />
    </MemoryRouter>,
  );
};

describe('HeaderContainer Component', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      logout: jest.fn(),
      user: null,
    });

    jest.clearAllMocks();
  });

  it('renders main container with banner role', () => {
    renderHeaderContainer();
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });

  it('renders the title correctly', () => {
    renderHeaderContainer({ title: 'Sky Listings' });
    expect(screen.getByText('Sky Listings')).toBeInTheDocument();
  });

  it('renders title as a link with correct href', () => {
    renderHeaderContainer({
      title: 'Sky Listings',
      link: 'home',
    });

    const titleLink = screen.getByLabelText('Sky Listings');
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', '/home');
  });

  it('calls setIsHamburgerMenuOpen when hamburger button is clicked', async () => {
    const user = userEvent.setup();
    const setIsHamburgerMenuOpen = jest.fn();

    renderHeaderContainer({ setIsHamburgerMenuOpen });

    const hamburgerButton = screen.getByLabelText(
      'Control hamburger navigation menu',
    );
    await user.click(hamburgerButton);

    expect(setIsHamburgerMenuOpen).toHaveBeenCalledTimes(1);
    expect(setIsHamburgerMenuOpen).toHaveBeenCalledWith(true);
  });

  it('does not show logout button when user is not authenticated', () => {
    renderHeaderContainer();
    expect(
      screen.queryByRole('button', { name: /logout/i }),
    ).not.toBeInTheDocument();
  });

  it('shows logout button when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
      user: 'john_doe',
    });

    renderHeaderContainer();

    expect(screen.getByText('john_doe')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /john_doe/i })).toHaveAttribute(
      'href',
      '/profilePage',
    );
    expect(screen.getByRole('link', { name: /logout/i })).toBeInTheDocument();
  });
});
