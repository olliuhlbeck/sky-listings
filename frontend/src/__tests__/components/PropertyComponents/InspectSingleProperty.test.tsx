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
});
