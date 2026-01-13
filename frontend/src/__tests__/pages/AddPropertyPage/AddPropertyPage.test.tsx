import { MemoryRouter } from 'react-router-dom';
import { AuthContextType } from '../../../types/auth/auth';
import { useAuth } from '../../../utils/useAuth';
import AddPropertyPage from '../../../pages/AddPropertyPage/AddPropertyPage';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock useAuth hook
jest.mock('../../../utils/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Render helper
const renderAddPropertyPage = () => {
  return render(
    <MemoryRouter>
      <AddPropertyPage />
    </MemoryRouter>,
  );
};

describe('AddPropertyPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      user: 'user1',
      userId: 2,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      token: 'fake-token',
      loading: false,
      profilePicture: null,
      updateProfilePicture: jest.fn(),
    } as AuthContextType);
  });

  it('should render AddPropertyPage main container correctly', () => {
    renderAddPropertyPage();

    const form = screen.getByRole('form', { name: /property information/i });
    expect(form).toBeInTheDocument();
  });

  it('should render submit button', () => {
    renderAddPropertyPage();

    const submitButton = screen.getByRole('button', { name: /add property/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should render all form sections with correct headings', () => {
    renderAddPropertyPage();

    expect(screen.getByText('Property information')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Property details')).toBeInTheDocument();
    expect(screen.getByText('Basic info')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Additional info')).toBeInTheDocument();
    expect(screen.getByText('Pictures')).toBeInTheDocument();
  });

  it('should update form fields when user types in them', async () => {
    const user = userEvent.setup();
    renderAddPropertyPage();

    const streetInput = screen.getByLabelText('Street:') as HTMLInputElement;
    const cityInput = screen.getByLabelText('City:') as HTMLInputElement;
    const priceInput = screen.getByLabelText('Price:') as HTMLInputElement;

    await user.type(streetInput, '123 Main St');
    await user.type(cityInput, 'Springfield');
    await user.type(priceInput, '250000');

    expect(streetInput.value).toBe('123 Main St');
    expect(cityInput.value).toBe('Springfield');
    expect(priceInput.value).toBe('250000');
  });

  it('should render all address input fields', () => {
    renderAddPropertyPage();

    expect(screen.getByLabelText('Street:')).toBeInTheDocument();
    expect(screen.getByLabelText('City:')).toBeInTheDocument();
    expect(screen.getByLabelText('State:')).toBeInTheDocument();
    expect(screen.getByLabelText('Postal code:')).toBeInTheDocument();
    expect(screen.getByLabelText('Country:')).toBeInTheDocument();
  });

  it('should display success message on successful submission', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, message: 'Property created' }),
    });

    renderAddPropertyPage();

    await user.type(screen.getByLabelText('Street:'), '123 Main St');
    await user.click(screen.getByRole('button', { name: /add property/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Property created successfully.'),
      ).toBeInTheDocument();
    });
  });

  it('should reset form fields after successful submission', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, message: 'Property created' }),
    });

    renderAddPropertyPage();

    const streetInput = screen.getByLabelText('Street:') as HTMLInputElement;
    const priceInput = screen.getByLabelText('Price:') as HTMLInputElement;

    await user.type(streetInput, '123 Main St');
    await user.type(priceInput, '250000');

    expect(streetInput.value).toBe('123 Main St');
    expect(priceInput.value).toBe('250000');

    await user.click(screen.getByRole('button', { name: /add property/i }));

    await waitFor(() => {
      expect(streetInput.value).toBe('');
      expect(priceInput.value).toBe('0');
    });
  });

  it('should display error message when API returns error response', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Failed to create property' }),
    });

    renderAddPropertyPage();

    await user.type(screen.getByLabelText('Street:'), '123 Main St');
    await user.click(screen.getByRole('button', { name: /add property/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to create property')).toBeInTheDocument();
    });
  });

  it('should display generic error message when API returns error without error field', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Something went wrong' }),
    });

    renderAddPropertyPage();

    await user.type(screen.getByLabelText('Street:'), '123 Main St');
    await user.click(screen.getByRole('button', { name: /add property/i }));

    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    renderAddPropertyPage();

    await user.type(screen.getByLabelText('Street:'), '123 Main St');
    await user.click(screen.getByRole('button', { name: /add property/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error: Network error/i)).toBeInTheDocument();
    });
  });

  it('should clear success message after 3 seconds', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, message: 'Property created' }),
    });

    renderAddPropertyPage();

    await user.type(screen.getByLabelText('Street:'), '123 Main St');
    await user.click(screen.getByRole('button', { name: /add property/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Property created successfully.'),
      ).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(
        screen.queryByText('Property created successfully.'),
      ).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('should clear error message after 3 seconds', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Failed to create property' }),
    });

    renderAddPropertyPage();

    await user.type(screen.getByLabelText('Street:'), '123 Main St');
    await user.click(screen.getByRole('button', { name: /add property/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to create property')).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(
        screen.queryByText('Failed to create property'),
      ).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('should include authorization token in request headers', async () => {
    const user = userEvent.setup();
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, message: 'Property created' }),
    });
    global.fetch = mockFetch;

    renderAddPropertyPage();

    await user.type(screen.getByLabelText('Street:'), '123 Main St');
    await user.click(screen.getByRole('button', { name: /add property/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer fake-token',
          },
        }),
      );
    });
  });

  it('should not reset form when submission fails', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Failed to create property' }),
    });

    renderAddPropertyPage();

    const streetInput = screen.getByLabelText('Street:') as HTMLInputElement;
    await user.type(streetInput, '123 Main St');

    expect(streetInput.value).toBe('123 Main St');

    await user.click(screen.getByRole('button', { name: /add property/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to create property')).toBeInTheDocument();
    });

    expect(streetInput.value).toBe('123 Main St');
  });
});
