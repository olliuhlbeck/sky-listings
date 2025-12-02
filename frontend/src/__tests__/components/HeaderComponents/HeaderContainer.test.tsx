import { MemoryRouter } from 'react-router-dom';
import { HeaderContainerProps } from '../../../types/HeaderContainerProps';
import HeaderContainer from '../../../components/HeaderComponents/HeaderContainer';
import { render, screen } from '@testing-library/react';

// mock useAuth globally for tests
jest.mock('../../../utils/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    logout: jest.fn(),
    user: null,
  }),
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
});
