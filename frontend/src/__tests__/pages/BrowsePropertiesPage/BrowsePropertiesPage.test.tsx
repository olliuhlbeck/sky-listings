import { render, screen, waitFor } from '@testing-library/react';
import BrowsePropertiesPage from '../../../pages/BrowsePropertiesPage/BrowsePropertiesPage';

// Mock fetch
global.fetch = jest.fn();

// Mock successful response helper
const mockSuccessfulFetch = (properties = [], totalCount = 0) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ properties, totalCount }),
  });
};

describe('BrowsePropertiesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Ensures main container div is rendered correctly
  it('renders main container', async () => {
    mockSuccessfulFetch();
    render(<BrowsePropertiesPage />);
    const mainDiv = screen.getByTestId('browse-properties-page-main-container');
    await waitFor(() => {
      expect(mainDiv).toBeInTheDocument();
    });
  });

  // Ensure search bar is rendered
  it('renders search bar', async () => {
    mockSuccessfulFetch();
    render(<BrowsePropertiesPage />);
    const searchBar = screen.getByTestId('browse-properties-page-search-bar');
    await waitFor(() => {
      expect(searchBar).toBeInTheDocument();
    });
  });

  // Ensure ad component is rendered
  it('renders ad component', async () => {
    mockSuccessfulFetch();
    render(<BrowsePropertiesPage />);
    const adComponent = screen.getByTestId('ad-component');
    await waitFor(() => {
      expect(adComponent).toBeInTheDocument();
    });
  });

  // Property cards fetch and render
  it('fetches and displays property cards', async () => {
    // Mock successful fetch response sample data
    const mockResponse = {
      totalCount: 2,
      properties: [
        {
          id: 1,
          street: '123 Main',
          city: 'Paris',
          price: 100000,
          propertyType: 'house',
          coverPicture: '',
          bedrooms: 2,
          bathrooms: 1,
        },
        {
          id: 2,
          street: '456 Elm',
          city: 'Lyon',
          price: 200000,
          propertyType: 'apartment',
          coverPicture: '',
          bedrooms: 3,
          bathrooms: 2,
        },
      ],
    };

    // Mock fetch to return mocked sample property data
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    render(<BrowsePropertiesPage />);

    // Loading spinner visible before loading completes
    expect(screen.getByText(/Loading properties/i)).toBeInTheDocument();

    // Wait for property cards to load
    await waitFor(() => {
      expect(screen.getByText('123 Main')).toBeInTheDocument();
      expect(screen.getByText('456 Elm')).toBeInTheDocument();
    });

    // Loading should be gone when loading completes
    expect(screen.queryByText(/Loading properties/i)).not.toBeInTheDocument();
  });

  // Handles fetch error gracefully
  it('handles fetch error gracefully', async () => {
    // Mock fetch to return an error
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });
    render(<BrowsePropertiesPage />);
    // Wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to fetch properties. Please try again./i),
      ).toBeInTheDocument();
    });
  });
});
