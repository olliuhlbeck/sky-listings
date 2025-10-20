import { render, screen, waitFor } from '@testing-library/react';
import EditProfileInfoForm from '../../../components/ProfileComponents/EditProfileInfoForm';
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

// Mock user data
const mockUserData = {
  address: '123 Test St',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '555-0123',
  preferredContactMethod: 'EMAIL',
};

describe('EditProfileInfoForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('authToken', 'mock-jwt-token');

    // Setup default successful fetch mock
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockUserData,
    });
  });

  const renderWithAuth = () => {
    return render(
      <AuthProvider>
        <EditProfileInfoForm />
      </AuthProvider>,
    );
  };

  it('renders the form correctly', async () => {
    renderWithAuth();

    // Wait for the form to load before verifying form elements presence
    await waitFor(() => {
      const formElement = screen.getByTestId('edit-profile-info-form');
      expect(formElement).toBeInTheDocument();
    });
  });
});
