import { MemoryRouter } from 'react-router-dom';
import { AuthContextType } from '../../../types/auth/auth';
import { useAuth } from '../../../utils/useAuth';
import AddPropertyPage from '../../../pages/AddPropertyPage/AddPropertyPage';
import { render, screen } from '@testing-library/react';

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

    const mainContainer = screen.getByTestId(
      'add-property-page-main-container',
    );
    expect(mainContainer).toBeInTheDocument();
  });

  it('should render submit button', () => {
    renderAddPropertyPage();

    const submitButton = screen.getByTestId('submit-add-property-button');
    expect(submitButton).toBeInTheDocument();
  });
});
