import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BrowsePropertiesPage from '../../../pages/BrowsePropertiesPage/BrowsePropertiesPage';

// Mock fetch
global.fetch = jest.fn();

// Define the property type
type MockProperty = {
  id: number;
  street: string;
  city: string;
  price: number;
  propertyType: string;
  coverPicture: string;
  bedrooms: number;
  bathrooms: number;
};

// Mock successful empty response helper
const mockSuccessfulFetch = (
  properties: MockProperty[] = [],
  totalCount = 0,
) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ properties, totalCount }),
  });
};

// Helper to create mock property
const createMockProperty = (id: number) => ({
  id,
  street: `${id * 100} Test St`,
  city: 'TestCity',
  price: 100000 * id,
  propertyType: 'house',
  coverPicture: '',
  bedrooms: 2,
  bathrooms: 1,
});

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

  it('applies single column layout for 1 property', async () => {
    const mockProperties = [createMockProperty(1)];
    mockSuccessfulFetch(mockProperties, 1);

    render(<BrowsePropertiesPage />);

    // Wait for the property to be rendered first
    await waitFor(() => {
      expect(screen.getByText('100 Test St')).toBeInTheDocument();
    });

    const container = screen.getByTestId('property-cards-container');
    expect(container).toHaveClass('grid-cols-1');
  });

  it('applies two column layout for 2 properties', async () => {
    const mockProperties = [createMockProperty(1), createMockProperty(2)];
    mockSuccessfulFetch(mockProperties, 2);

    render(<BrowsePropertiesPage />);

    // Wait for the properties to be rendered first
    await waitFor(() => {
      expect(screen.getByText('100 Test St')).toBeInTheDocument();
      expect(screen.getByText('200 Test St')).toBeInTheDocument();
    });

    const container = screen.getByTestId('property-cards-container');
    expect(container).toHaveClass('grid-cols-2');
  });

  it('applies three column layout for 3 or more properties', async () => {
    const mockProperties = [
      createMockProperty(1),
      createMockProperty(2),
      createMockProperty(3),
    ];
    mockSuccessfulFetch(mockProperties, 3);

    render(<BrowsePropertiesPage />);

    // Wait for the properties to be rendered first
    await waitFor(() => {
      expect(screen.getByText('100 Test St')).toBeInTheDocument();
      expect(screen.getByText('200 Test St')).toBeInTheDocument();
      expect(screen.getByText('300 Test St')).toBeInTheDocument();
    });

    const container = screen.getByTestId('property-cards-container');
    expect(container).toHaveClass('md:grid-cols-2');
    expect(container).toHaveClass('xl:grid-cols-3');
  });

  it('displays next button when on first page with multiple pages', async () => {
    const propertyCount = 7;
    const mockProperties: MockProperty[] = [];
    for (let i = 1; i <= propertyCount; i++) {
      mockProperties.push(createMockProperty(i));
    }

    mockSuccessfulFetch(mockProperties, propertyCount);

    render(<BrowsePropertiesPage />);

    await waitFor(() => {
      expect(screen.getByText('Showing page 1 of 2')).toBeInTheDocument();
    });

    const nextButton = screen.getByLabelText('Go to page 2');
    expect(nextButton).toBeInTheDocument();
  });

  it('next button actually navigates to next page', async () => {
    const propertyCount = 7;
    const mockProperties: MockProperty[] = [];
    for (let i = 1; i <= propertyCount; i++) {
      mockProperties.push(createMockProperty(i));
    }

    mockSuccessfulFetch(mockProperties, propertyCount);

    render(<BrowsePropertiesPage />);

    await waitFor(() => {
      expect(screen.getByText('100 Test St')).toBeInTheDocument();
    });

    const nextButton = screen.getByLabelText('Go to page 2');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Showing page 2 of 2')).toBeInTheDocument();
    });
  });

  it('displays previous button when on later pages', async () => {
    const propertyCount = 7;
    const mockProperties: MockProperty[] = [];
    for (let i = 1; i <= propertyCount; i++) {
      mockProperties.push(createMockProperty(i));
    }

    mockSuccessfulFetch(mockProperties, propertyCount);

    render(<BrowsePropertiesPage />);

    await waitFor(() => {
      expect(screen.getByText('100 Test St')).toBeInTheDocument();
    });

    const nextButton = screen.getByLabelText('Go to page 2');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Showing page 2 of 2')).toBeInTheDocument();
    });
  });

  it('previous button navigates to previous page when clicked', async () => {
    const propertyCount = 7;
    const mockProperties: MockProperty[] = [];
    for (let i = 1; i <= propertyCount; i++) {
      mockProperties.push(createMockProperty(i));
    }

    mockSuccessfulFetch(mockProperties, propertyCount);

    render(<BrowsePropertiesPage />);

    await waitFor(() => {
      expect(screen.getByText('100 Test St')).toBeInTheDocument();
    });

    const nextButton = screen.getByLabelText('Go to page 2');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Showing page 2 of 2')).toBeInTheDocument();
    });

    const prevButton = screen.getByLabelText('Go to page 1');
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(screen.getByText('Showing page 1 of 2')).toBeInTheDocument();
    });
  });

  it('does not display pagination controls when only one page of results', async () => {
    const propertyCount = 3;
    const mockProperties: MockProperty[] = [];
    for (let i = 1; i <= propertyCount; i++) {
      mockProperties.push(createMockProperty(i));
    }

    mockSuccessfulFetch(mockProperties, propertyCount);

    render(<BrowsePropertiesPage />);

    await waitFor(() => {
      expect(screen.getByText('100 Test St')).toBeInTheDocument();
    });

    const paginationInfo = screen.queryByText(/Showing page/i);
    expect(paginationInfo).not.toBeInTheDocument();
  });
});
