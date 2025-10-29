import { render, screen } from '@testing-library/react';
import ProfilePage from '../../../pages/ProfilePage/ProfilePage';

// Mock child components to isolate ProfilePage tests
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

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Ensures main container div is rendered correctly
  it('renders main container', () => {
    render(<ProfilePage />);

    const mainDiv = screen.getByTestId('profile-page-main-container');
    expect(mainDiv).toBeInTheDocument();
  });

  // Verifies layout classes center content
  it('applies correct centering classes', () => {
    render(<ProfilePage />);

    const mainDiv = screen.getByTestId('profile-page-main-container');
    expect(mainDiv).toHaveClass('mx-auto');
  });

  // Checks that the page heading renders correctly with proper styling
  it('renders heading with correct text and border style', () => {
    render(<ProfilePage />);

    const heading = screen.getByText(/profile information/i);
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Profile information');
    expect(heading).toHaveClass('border-b');
  });

  // Confirms both mocked child components are rendered
  it('renders UserProfilePictureChanger and EditProfileInfoForm', () => {
    render(<ProfilePage />);

    const pictureChanger = screen.getByTestId('profile-picture-changer');
    const formComponent = screen.getByTestId('edit-profile-form');
    expect(pictureChanger).toBeInTheDocument();
    expect(formComponent).toBeInTheDocument();
  });
});
