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
});
