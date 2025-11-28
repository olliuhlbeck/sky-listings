import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BrowsePropertiesPage from '../../../pages/BrowsePropertiesPage/BrowsePropertiesPage';
import userEvent from '@testing-library/user-event';
import { InspectSinglePropertyProps } from '../../../types/InspectSinglePropertyProps';
import { FC } from 'react';

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

jest.mock(
  '../../../components/PropertyComponents/InspectSingleProperty',
  () => {
    const MockInspectSingleProperty: FC<InspectSinglePropertyProps> = ({
      onClick,
    }) => (
      <div>
        <button onClick={onClick}>Back</button>
      </div>
    );
    return { __esModule: true, default: MockInspectSingleProperty };
  },
);

describe('BrowsePropertiesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders main container', async () => {
    mockSuccessfulFetch();
    render(<BrowsePropertiesPage />);
    const mainDiv = screen.getByRole('main');
    await waitFor(() => {
      expect(mainDiv).toBeInTheDocument();
    });
  });

  it('renders search bar', async () => {
    mockSuccessfulFetch();
    render(<BrowsePropertiesPage />);
    const searchBar = screen.getByRole('button', { name: /Search/i });
    await waitFor(() => {
      expect(searchBar).toBeInTheDocument();
    });
  });

  it('renders ad component', async () => {
    mockSuccessfulFetch();
    render(<BrowsePropertiesPage />);
    const adComponent = screen.getByText('Apply for loan');
    await waitFor(() => {
      expect(adComponent).toBeInTheDocument();
    });
  });

  it('shows loading spinner when navigating between pages', async () => {
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

    mockSuccessfulFetch(mockProperties, propertyCount);

    const nextButton = screen.getByLabelText('Go to page 2');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Loading properties/i)).toBeInTheDocument();
    });
  });

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

    expect(screen.getByText(/Loading properties/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('123 Main')).toBeInTheDocument();
      expect(screen.getByText('456 Elm')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Loading properties/i)).not.toBeInTheDocument();
  });

  it('handles fetch error gracefully', async () => {
    // Mock fetch to return an error
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });
    render(<BrowsePropertiesPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to fetch properties. Please try again./i),
      ).toBeInTheDocument();
    });
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

  it('updates search term when user types in search input', async () => {
    mockSuccessfulFetch();
    render(<BrowsePropertiesPage />);

    const searchInput = screen.getByPlaceholderText('Search properties...');
    await userEvent.type(searchInput, 'Paris');

    expect(searchInput).toHaveValue('Paris');
  });

  it('triggers new fetch when search is clicked', async () => {
    const mockProperties = [createMockProperty(1)];
    mockSuccessfulFetch(mockProperties, 1);

    render(<BrowsePropertiesPage />);

    await waitFor(() => {
      expect(screen.getByText('100 Test St')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search properties...');
    await userEvent.type(searchInput, 'Test');
    const searchButton = screen.getByRole('button', { name: /Search/i });
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('triggers search when Enter key is pressed in search input', async () => {
    const mockProperties = [createMockProperty(1)];
    mockSuccessfulFetch(mockProperties, 1);

    render(<BrowsePropertiesPage />);

    await waitFor(() => {
      expect(screen.getByText('100 Test St')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search properties...');
    await userEvent.type(searchInput, 'Test{enter}');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('changes search condition when dropdown selection changes', async () => {
    mockSuccessfulFetch();
    render(<BrowsePropertiesPage />);

    const dropdown = screen.getByLabelText('Search condition');
    await userEvent.selectOptions(dropdown, 'city');

    expect(dropdown).toHaveValue('city');
  });

  it('clears search term when X button is clicked', async () => {
    mockSuccessfulFetch();
    render(<BrowsePropertiesPage />);

    expect(screen.queryByLabelText('Clear term')).not.toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search properties...');

    await userEvent.type(searchInput, 'TestSearch');
    expect(searchInput).toHaveValue('TestSearch');

    const closeButton = screen.getByRole('button', {
      name: 'clear term',
    });
    await userEvent.click(closeButton);

    expect(searchInput).toHaveValue('');

    expect(screen.queryByLabelText('/Clear term/i')).not.toBeInTheDocument();
  });

  it('resets to page 1 when search is performed', async () => {
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
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Showing page 2 of 2')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search properties...');
    await userEvent.type(searchInput, 'New Search');
    const searchButton = screen.getByRole('button', { name: /Search/i });
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Showing page 1 of 2')).toBeInTheDocument();
    });
  });

  it('includes search parameters in fetch URL', async () => {
    mockSuccessfulFetch();
    render(<BrowsePropertiesPage />);

    const dropdown = screen.getByLabelText('Search condition');
    await userEvent.selectOptions(dropdown, 'city');

    const searchInput = screen.getByPlaceholderText('Search properties...');
    await userEvent.type(searchInput, 'Paris');

    const searchButton = screen.getByRole('button', { name: /Search/i });
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('searchTerm=Paris&searchCondition=city'),
      );
    });
  });

  it('switches to single property view when property card is clicked', async () => {
    const mockProperties = [createMockProperty(1)];
    mockSuccessfulFetch(mockProperties, 1);

    render(<BrowsePropertiesPage />);

    await waitFor(() => {
      expect(screen.getByText('100 Test St')).toBeInTheDocument();
    });

    const propertyButton = screen.getByLabelText(
      'View details for 100 Test St, TestCity',
    );
    await userEvent.click(propertyButton);

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('returns to browse view when back button is clicked from single property view', async () => {
    const mockProperties = [createMockProperty(1)];
    mockSuccessfulFetch(mockProperties, 1);

    render(<BrowsePropertiesPage />);

    await waitFor(() => {
      expect(screen.getByText('100 Test St')).toBeInTheDocument();
    });

    const propertyButton = screen.getByLabelText(
      'View details for 100 Test St, TestCity',
    );
    await userEvent.click(propertyButton);

    const backButton = screen.getByRole('button', {
      name: /back/i,
    });
    await userEvent.click(backButton);

    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  it('preserves search term and condition when navigating between pages', async () => {
    const propertyCount = 7;
    const mockProperties: MockProperty[] = [];
    for (let i = 1; i <= propertyCount; i++) {
      mockProperties.push(createMockProperty(i));
    }

    mockSuccessfulFetch(mockProperties, propertyCount);

    render(<BrowsePropertiesPage />);

    const dropdown = screen.getByLabelText('Search condition');
    await userEvent.selectOptions(dropdown, 'city');

    const searchInput = screen.getByPlaceholderText('Search properties...');
    await userEvent.type(searchInput, 'TestCity');

    mockSuccessfulFetch(mockProperties, propertyCount);

    const searchButton = screen.getByRole('button', { name: /Search/i });
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('100 Test St')).toBeInTheDocument();
    });

    mockSuccessfulFetch(mockProperties, propertyCount);

    const nextButton = screen.getByLabelText('Go to page 2');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining('searchTerm=TestCity&searchCondition=city'),
      );
    });
  });

  it('displays "No properties found" message when search returns empty results', async () => {
    mockSuccessfulFetch([], 0);

    render(<BrowsePropertiesPage />);

    const searchInput = screen.getByPlaceholderText('Search properties...');
    await userEvent.type(searchInput, 'NonexistentCity');

    mockSuccessfulFetch([], 0);

    const searchButton = screen.getByRole('button', { name: /Search/i });
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/No properties found/i)).toBeInTheDocument();
    });
  });
});
