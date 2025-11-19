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
      user: null,
      userId: null,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
      token: null,
      loading: false,
      authError: undefined,
    } as AuthContextType);
  });

  it('should render AddPropertyPage main container correctly', () => {
    renderAddPropertyPage();

    const mainContainer = screen.getByTestId(
      'add-property-page-main-container',
    );
    expect(mainContainer).toBeInTheDocument();
  });
});
