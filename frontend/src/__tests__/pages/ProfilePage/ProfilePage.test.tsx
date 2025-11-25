import { render, screen } from '@testing-library/react';
import ProfilePage from '../../../pages/ProfilePage/ProfilePage';

// Mock child components to isolate ProfilePage tests
jest.mock('../../../components/ProfileComponents/EditProfileInfoForm', () => ({
  __esModule: true,
  default: () => <div>Edit Profile Form Mock</div>,
}));
jest.mock(
  '../../../components/ProfileComponents/UserProfilePictureChanger',
  () => ({
    __esModule: true,
    default: () => <div>Profile Picture Changer Mock</div>,
  }),
);

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders main container', () => {
    render(<ProfilePage />);

    const mainDiv = screen.getByRole('main');
    expect(mainDiv).toBeInTheDocument();
  });

  it('renders the page heading', () => {
    render(<ProfilePage />);

    expect(
      screen.getByRole('heading', {
        name: /profile information/i,
        level: 2,
      }),
    ).toBeInTheDocument();
  });

  it('renders UserProfilePictureChanger and EditProfileInfoForm', () => {
    render(<ProfilePage />);

    const pictureChanger = screen.getByText('Profile Picture Changer Mock');
    const formComponent = screen.getByText('Edit Profile Form Mock');
    expect(pictureChanger).toBeInTheDocument();
    expect(formComponent).toBeInTheDocument();
  });
});
