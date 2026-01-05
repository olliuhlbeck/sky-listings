import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InspectSingleProperty from '../../../components/PropertyComponents/InspectSingleProperty';
import { PropertyResponse } from '../../../types/dtos/PropertyResponse.dto';

// Mock fetch
global.fetch = jest.fn();

// Mock property data helper
const createMockProperty = (overrides = {}): PropertyResponse => ({
  id: 1,
  userId: 123,
  street: '123 Main St',
  city: 'Paris',
  state: 'Île-de-France',
  country: 'France',
  postalCode: '75001',
  price: 500000,
  propertyType: 'house',
  propertyStatus: 'for_sale',
  coverPicture: 'base64ImageString',
  bedrooms: 3,
  bathrooms: 2,
  squareMeters: 120,
  description: 'A beautiful property in the heart of Paris',
  additionalInfo: 'Recently renovated with modern amenities',
  createdAt: new Date('2023-01-01T00:00:00Z'),
  ...overrides,
});

// Mock contact info response
const mockContactInfo = {
  phoneNumber: '+33 1 23 45 67 89',
  email: 'seller@example.com',
  preferredContactMethod: 'email',
};

// Mock pictures response
const mockPictures = {
  pictures: ['image1Base64', 'image2Base64', 'image3Base64'],
};

describe('InspectSingleProperty', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders property basic information correctly', async () => {
    const mockProperty = createMockProperty();

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockContactInfo,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPictures,
      });

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    // Wait for async operations to complete
    await waitFor(() => {
      expect(screen.getByText('+33 1 23 45 67 89')).toBeInTheDocument();
    });

    expect(screen.getByText('Property Information')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('500 000 €')).toBeInTheDocument();
    expect(screen.getByText('3 bedrooms')).toBeInTheDocument();
    expect(screen.getByText('2 bathrooms')).toBeInTheDocument();
    expect(screen.getByText('120 m²')).toBeInTheDocument();
  });

  it('calls onClick when back button is clicked', async () => {
    const mockProperty = createMockProperty();

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockContactInfo,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPictures,
      });

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    // Wait for async operations to complete
    await waitFor(() => {
      expect(screen.getByText('+33 1 23 45 67 89')).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', {
      name: /back to browsing/i,
    });
    await userEvent.click(backButton);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('fetches and displays contact information', async () => {
    const mockProperty = createMockProperty();

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockContactInfo,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPictures,
      });

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    expect(screen.getByText(/Loading contact info.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('+33 1 23 45 67 89')).toBeInTheDocument();
      expect(screen.getByText('seller@example.com')).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/Loading contact info.../i),
    ).not.toBeInTheDocument();
  });

  it('displays error message when contact info fetch fails', async () => {
    const mockProperty = createMockProperty();

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPictures,
      });

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load contact info. Please try again./i),
      ).toBeInTheDocument();
    });
  });

  it('displays additional pictures and allows switching between them', async () => {
    const mockProperty = createMockProperty();

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockContactInfo,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPictures,
      });

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    await waitFor(() => {
      const thumbnails = screen.getAllByAltText(/Thumbnail/i);
      expect(thumbnails).toHaveLength(3);
    });

    const firstThumbnail = screen.getByAltText('Thumbnail 1');
    await userEvent.click(firstThumbnail);

    expect(firstThumbnail).toHaveClass('border-blue-400');
  });

  it('displays both loading spinners on initial render', async () => {
    const mockProperty = createMockProperty();

    (global.fetch as jest.Mock)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ ok: true, json: async () => mockContactInfo }),
              100,
            ),
          ),
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ ok: true, json: async () => mockPictures }),
              100,
            ),
          ),
      );

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    expect(screen.getByText(/Loading contact info.../i)).toBeInTheDocument();
    expect(
      screen.getByText(/Loading additional pictures.../i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('+33 1 23 45 67 89')).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/Loading contact info.../i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Loading additional pictures.../i),
    ).not.toBeInTheDocument();
  });

  it('calls correct API URLs with proper parameters', async () => {
    const mockProperty = createMockProperty({ userId: 456, id: 789 });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockContactInfo,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPictures,
      });

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/info/getContactInfoForProperty?userId=456',
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/property/getAllImagesForProperty?propertyId=789',
    );
  });

  it('should not call contact fetch when userId is null', async () => {
    const mockProperty = createMockProperty({ userId: null });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPictures,
    });

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/Loading contact info.../i),
      ).not.toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('getAllImagesForProperty'),
    );
  });

  it('should not call images fetch when propertyId is null', async () => {
    const mockProperty = createMockProperty({ id: null });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockContactInfo,
    });

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    await waitFor(() => {
      expect(screen.getByText('+33 1 23 45 67 89')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('getContactInfoForProperty'),
    );
  });

  it('displays singular labels for single bedroom and bathroom', async () => {
    const mockProperty = createMockProperty({ bedrooms: 1, bathrooms: 1 });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockContactInfo,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPictures,
      });

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    await waitFor(() => {
      expect(screen.getByText('1 bedroom')).toBeInTheDocument();
      expect(screen.getByText('1 bathroom')).toBeInTheDocument();
    });

    expect(screen.queryByText('1 bedrooms')).not.toBeInTheDocument();
    expect(screen.queryByText('1 bathrooms')).not.toBeInTheDocument();
  });

  it('displays "Not specified" when preferredContactMethod is null', async () => {
    const mockProperty = createMockProperty();
    const contactInfoWithNullPreference = {
      ...mockContactInfo,
      preferredContactMethod: null,
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => contactInfoWithNullPreference,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPictures,
      });

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    await waitFor(() => {
      expect(screen.getByText('Not specified')).toBeInTheDocument();
    });
  });

  it('renders single column layout when additionalInfo is missing', async () => {
    const mockProperty = createMockProperty({ additionalInfo: null });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockContactInfo,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPictures,
      });

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    await waitFor(() => {
      expect(screen.getByText('+33 1 23 45 67 89')).toBeInTheDocument();
    });

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(
      screen.queryByText('Additional Information'),
    ).not.toBeInTheDocument();
  });

  it('displays placeholder when cover picture is missing', async () => {
    const mockProperty = createMockProperty({ coverPicture: null });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockContactInfo,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPictures,
      });

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    await waitFor(() => {
      expect(screen.getByText(/No image available/i)).toBeInTheDocument();
    });
  });

  it('displays message when pictures array is empty', async () => {
    const mockProperty = createMockProperty();

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockContactInfo,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ pictures: [] }),
      });

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No additional pictures available./i),
      ).toBeInTheDocument();
    });
  });

  it('displays error message when pictures fetch throws network error', async () => {
    const mockProperty = createMockProperty();

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockContactInfo,
      })
      .mockRejectedValueOnce(new Error('Network error'));

    render(
      <InspectSingleProperty property={mockProperty} onClick={mockOnClick} />,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load more pictures. Please try again./i),
      ).toBeInTheDocument();
    });
  });
});
