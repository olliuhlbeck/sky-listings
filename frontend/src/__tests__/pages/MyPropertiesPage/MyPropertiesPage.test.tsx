import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MyProperties from '../../../pages/MyPropertiesPage/MyPropertiesPage';
import { AuthContextType } from '../../../types/auth/auth';
import { useAuth } from '../../../utils/useAuth';

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock react-router-dom navigation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock useAuth hook
jest.mock('../../../utils/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock AdComponent
jest.mock('../../../components/GeneralComponents/AdComponent', () => {
  return function MockAdComponent() {
    return <div data-testid='ad-component'>Ad Component</div>;
  };
});

const mockProperties = [
  { id: 1, street: '123 Main St', city: 'TestCity', state: 'TS', zip: '12345' },
  { id: 2, street: '456 Oak Ave', city: 'TestTown', state: 'TT', zip: '67890' },
  {
    id: 3,
    street: '789 Pine Rd',
    city: 'TestVille',
    state: 'TV',
    zip: '11111',
  },
];

const renderMyProperties = () => {
  return render(
    <MemoryRouter>
      <MyProperties />
    </MemoryRouter>,
  );
};

describe('MyProperties Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      user: 'testuser',
      userId: 1,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      token: 'faketoken',
      loading: false,
      authError: undefined,
    } as AuthContextType);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ usersProperties: mockProperties }),
    });
  });

  it('should render AdComponent', async () => {
    renderMyProperties();

    await waitFor(() => {
      expect(screen.getByTestId('ad-component')).toBeInTheDocument();
    });
  });

  it('should fetch and display property selection buttons on mount', async () => {
    renderMyProperties();

    await waitFor(() => {
      expect(
        screen.getByTestId('property-selection-buttons-container'),
      ).toBeInTheDocument();
    });

    const buttons = screen.getAllByTestId('property-button');
    expect(buttons.length).toBe(3);
  });
});
