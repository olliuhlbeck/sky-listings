import { render, screen } from '@testing-library/react';
import ProfilePage from '../../../pages/ProfilePage/ProfilePage';

// Mock child components
jest.mock('../../../components/ProfileComponents/EditProfileInfoForm', () => ({
  __esModule: true,
  default: () => (
    <div data-testid='edit-profile-form'>Edit Profile Form Mock</div>
  ),
}));
jest.mock(
  '../../../components/ProfileComponents/UserProfilePictureChanger',
  () => ({
    __esModule: true,
    default: () => (
      <div data-testid='profile-picture-changer'>
        Profile Picture Changer Mock
      </div>
    ),
  }),
);

// Profile page
describe('ProfilePage', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  // Renders main container
  it('renders ProfilePage components main container div', () => {
    render(<ProfilePage />);

    const mainDiv = screen.getByTestId('profile-page-main-container');
    expect(mainDiv).toBeInTheDocument();
  });

  // Should center content
  it('renders main container with correct classes for centering content', () => {
    render(<ProfilePage />);

    const mainDiv = screen.getByTestId('profile-page-main-container');
    expect(mainDiv).toHaveClass('mx-auto');
  });

  // Has correct heading
  it('renders correct heading text', () => {
    render(<ProfilePage />);

    const heading = screen.getByText(/profile information/i);
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Profile information');
  });

  // Heading has bottom border
  it('renders heading with bottom border', () => {
    render(<ProfilePage />);

    const heading = screen.getByText(/profile information/i);
    expect(heading).toHaveClass('border-b');
  });

  // Renders UserProfilePictureChanger component
  it('renders UserProfilePictureChanger component', () => {
    render(<ProfilePage />);

    const pictureChanger = screen.getByTestId('profile-picture-changer');
    expect(pictureChanger).toBeInTheDocument();
  });

  // Renders EditProfileInfoForm component
  it('renders EditProfileInfoForm component', () => {
    render(<ProfilePage />);

    const formComponent = screen.getByTestId('edit-profile-form');
    expect(formComponent).toBeInTheDocument();
  });
});
