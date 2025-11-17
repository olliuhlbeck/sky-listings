import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MyProperties from '../../../pages/MyPropertiesPage/MyPropertiesPage';
import { AuthContextType } from '../../../types/auth/auth';
import { useAuth } from '../../../utils/useAuth';

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock react-router-dom navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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

// Mock PropertyInfoEditForm
jest.mock('../../../components/PropertyComponents/PropertyInfoEditForm', () => {
  return function MockPropertyInfoEditForm({
    property,
  }: {
    property: { id: number; street: string };
    originalProperty: { id: number; street: string };
    onPropertyUpdate: (updated: { id: number; street: string }) => void;
  }) {
    return (
      <div data-testid='property-edit-form'>Editing: {property.street}</div>
    );
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

  it('should display loading state while fetching properties', () => {
    // Mock a slow fetch to catch loading state and never resolve
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    renderMyProperties();

    expect(screen.getByTestId('loading-properties-text')).toBeInTheDocument();
  });

  it('should hide loading state after properties are fetched', async () => {
    renderMyProperties();

    await waitFor(() => {
      expect(
        screen.queryByText('Loading your properties...'),
      ).not.toBeInTheDocument();
    });
  });

  it('should display error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error'),
    );

    renderMyProperties();

    await waitFor(() => {
      expect(
        screen.getByText('Failed to fetch your properties. Please try again.'),
      ).toBeInTheDocument();
    });
  });

  it('should navigate to add property page when clicking add button', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ usersProperties: [] }),
    });

    renderMyProperties();

    await waitFor(() => {
      expect(screen.getByText('Add Your First Property')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add Your First Property'));
    expect(mockNavigate).toHaveBeenCalledWith('/addProperty');
  });

  it('should not fetch any properties if userId is null', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      userId: null,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
      token: null,
      loading: false,
    } as AuthContextType);

    renderMyProperties();

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should display all property names correctly', async () => {
    renderMyProperties();

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('456 Oak Ave')).toBeInTheDocument();
      expect(screen.getByText('789 Pine Rd')).toBeInTheDocument();
    });
  });

  it('should delete property when confirmed in modal', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ usersProperties: mockProperties }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    renderMyProperties();

    await waitFor(() => {
      expect(screen.getAllByTestId('property-button').length).toBe(3);
    });

    fireEvent.click(screen.getByText('123 Main St'));

    fireEvent.click(screen.getByText('Delete selected property'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/property/delete/1'),
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  it('should close delete modal when cancel is clicked', async () => {
    renderMyProperties();

    await waitFor(() => {
      expect(screen.getAllByTestId('property-button').length).toBe(3);
    });

    fireEvent.click(screen.getByText('123 Main St'));
    fireEvent.click(screen.getByText('Delete selected property'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    });
  });

  it('should show delete confirmation modal when property is selected and delete is clicked', async () => {
    renderMyProperties();

    await waitFor(() => {
      expect(screen.getAllByTestId('property-button').length).toBe(3);
    });

    fireEvent.click(screen.getByText('123 Main St'));

    await waitFor(() => {
      expect(screen.getByTestId('property-edit-form')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete selected property'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      expect(
        screen.getByText(/Are you sure you want to delete the property at/i),
      ).toBeInTheDocument();
    });
  });
});
