import { MemoryRouter } from 'react-router-dom';
import { AuthContextType } from '../../../types/auth/auth';
import { useAuth } from '../../../utils/useAuth';
import AddPropertyPage from '../../../pages/AddPropertyPage/AddPropertyPage';
import { render, screen } from '@testing-library/react';
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
});
