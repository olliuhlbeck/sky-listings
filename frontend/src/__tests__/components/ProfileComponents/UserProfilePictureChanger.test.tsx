import { render, screen, waitFor } from '@testing-library/react';
import UserProfilePictureChanger from '../../../components/ProfileComponents/UserProfilePictureChanger';
import AuthProvider from '../../../components/AuthComponents/AuthProvider';

// Mock fetch
global.fetch = jest.fn();

// Mock jwt-decode
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({
    username: 'testuser',
    userId: 123,
    exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
  })),
}));

describe('UserProfilePictureChanger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('authToken', 'mock-jwt-token');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderWithAuth = () => {
    return render(
      <AuthProvider>
        <UserProfilePictureChanger />
      </AuthProvider>,
    );
  };

  // Check if component renders
  it('renders main component without crashing', async () => {
    renderWithAuth();

    await waitFor(() => {
      const mainDiv = screen.getByTestId('user-profile-picture-changer');
      expect(mainDiv).toBeInTheDocument();
    });
  });

  // Check if profile picture is displayed when it exists
  it('displays the current profile picture', async () => {
    // Mock fetch response for getting profile picture
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        profilePicture: 'http://example.com/profile.png',
      }),
    });

    renderWithAuth();

    await waitFor(() => {
      const profilePic = screen.getByAltText('profilePicture');
      expect(profilePic).toBeInTheDocument();
    });
  });

  // Check if default icon is displayed when no profile picture exists
  it('displays icon dummy in default case', async () => {
    // Mock fetch response for getting profile picture
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        profilePicture: null,
      }),
    });

    renderWithAuth();

    await waitFor(() => {
      const placeholder = screen.getByTestId('profilePicturePlaceholder');
      expect(placeholder).toBeInTheDocument();
    });
  });

  // Click on profile picture or dummy fires file input
  it('opens file dialog when clicking on profile picture / dummy or Change profile picture button', async () => {
    renderWithAuth();

    await waitFor(() => {
      const changeArea = screen.getByTestId('profilePicturePlaceholder');
      expect(changeArea).toBeInTheDocument();
    });

    // Check that clicking on the profile picture area triggers file input
    const changeArea = screen.getByTestId(
      'profilePicturePlaceholder',
    ) as HTMLSpanElement;
    const fileInput = screen.getByTestId(
      'profile-picture-file-input',
    ) as HTMLInputElement;
    const fileInputClickSpy = jest.spyOn(fileInput, 'click');
    changeArea.click();
    expect(fileInputClickSpy).toHaveBeenCalled();

    // Check clicking on the button triggers file input
    const changeButton = screen.getByText(/Change Profile Picture/i);
    const fileInputClickSpy2 = jest.spyOn(fileInput, 'click');
    changeButton.click();
    expect(fileInputClickSpy2).toHaveBeenCalled();
  });
});
