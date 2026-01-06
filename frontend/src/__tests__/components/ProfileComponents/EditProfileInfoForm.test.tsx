import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  // Basic check to ensure the form renders at all
  it('renders the form correctly', async () => {
    renderWithAuth();

    // Wait for the form to load before verifying form elements presence
    await waitFor(() => {
      const formElement = screen.getByTestId('edit-profile-info-form');
      expect(formElement).toBeInTheDocument();
    });
  });

  it('loads and displays user data correctly', async () => {
    renderWithAuth();

    // Wait for first name input (to confirm data loaded)
    await screen.findByDisplayValue(mockUserData.firstName);

    // Check that all fields are populated with mock data
    expect(screen.getByDisplayValue(mockUserData.lastName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUserData.address)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUserData.email)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockUserData.phoneNumber),
    ).toBeInTheDocument();

    // Separate select element check since it's not an input
    const select = screen.getByLabelText(/Preferred contact style/i);
    expect((select as HTMLSelectElement).value).toBe('EMAIL');
  });

  it('displays an error message when user data fails to load', async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
      // Let AuthProvider or other calls succeed
      if (!url.includes('getAllUserInfo')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({}),
        });
      }

      // Make the profile fetch fail
      return Promise.resolve({
        ok: false,
        status: 500,
      });
    });

    renderWithAuth();

    // The actual error message from your component's catch block
    const errorMessage = await screen.findByText(
      /Failed to fetch profile information/i,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('Updates changed profile information successfully', async () => {
    // Setup fetch mock for initial data load
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    // Mock update fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockUserData, firstName: 'Jane' }),
    });

    renderWithAuth();

    await waitFor(() => screen.getByDisplayValue(mockUserData.firstName));

    // Change first name input
    const firstNameInput = screen.getByLabelText(/First Name/i);
    await userEvent.type(firstNameInput, 'Jane');

    // Save the updated data
    const saveButton = screen.getByRole('button', { name: /Save changes/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      const successMessage = screen.getByText(/Profile updated successfully!/i);
      expect(successMessage).toBeInTheDocument();
    });
  });

  it('displays an error message when profile information update fails', async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
      // Initial profile load succeeds
      if (url.includes('getAllUserInfo')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockUserData,
        });
      }

      // Update call fails
      if (url.includes('updateUserInfo')) {
        return Promise.resolve({
          ok: false,
          status: 400,
          json: async () => ({ error: 'Bad request' }),
        });
      }

      // Any other calls succeed
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      });
    });

    renderWithAuth();

    // Wait for data to load
    await screen.findByDisplayValue(mockUserData.firstName);

    // Change first name input
    const firstNameInput = screen.getByLabelText(/First Name/i);
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Jane');

    // Wait for the save button to become enabled
    const saveButton = screen.getByRole('button', { name: /Save changes/i });

    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    });

    // Click the save button
    await userEvent.click(saveButton);

    // Wait for error message
    const errorMessage = await screen.findByText(/Bad request/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('disables the Save button when no form changes are made', async () => {
    renderWithAuth();

    // Wait for data to load
    await screen.findByDisplayValue(mockUserData.firstName);

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    expect(saveButton).toBeDisabled();
  });

  it('resets form to original values when reset button clicked', async () => {
    renderWithAuth();

    await waitFor(() => screen.getByDisplayValue(mockUserData.firstName));

    const firstNameInput = screen.getByLabelText(/First name/i);
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Changed');
    const resetButton = screen.getByText(/Reset form/i);
    await userEvent.click(resetButton);
    expect(
      screen.getByDisplayValue(mockUserData.firstName),
    ).toBeInTheDocument();
  });
});
