import { render, screen } from '@testing-library/react';
import PropertyCard from '../../../components/PropertyComponents/PropertyCard';
import { PropertyCardProps } from '../../../types/PropertyCardProps';

// Render helper function
const renderPropertyCard = (props: Partial<PropertyCardProps> = {}) => {
  const defaultProps: PropertyCardProps = {
    imageUrl: 'https://example.com/image.jpg',
    beds: 3,
    baths: 2,
    street: '123 Main St',
    city: 'San Francisco',
    formattedPrice: '$500,000',
    propertyType: 'Single Family',
    ...props,
  };

  return render(<PropertyCard {...defaultProps} />);
};

describe('PropertyCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the property image with correct background', () => {
    renderPropertyCard();
    const imageDiv = screen.getByRole('img');
    expect(imageDiv).toHaveAccessibleName(
      'Single Family in 123 Main St, San Francisco',
    );
  });

  it('displays the property type badge', () => {
    renderPropertyCard({ propertyType: 'Condo' });
    expect(screen.getByText('Condo')).toBeInTheDocument();
  });

  it('displays the street address', () => {
    renderPropertyCard({ street: '456 Oak Avenue' });
    expect(screen.getByText('456 Oak Avenue')).toBeInTheDocument();
  });

  it('displays the city', () => {
    renderPropertyCard({ city: 'Los Angeles' });
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
  });

  it('displays the formatted price', () => {
    renderPropertyCard({ formattedPrice: '$1,250,000' });
    expect(screen.getByText('$1,250,000')).toBeInTheDocument();
  });

  it('displays singular "bed" when beds is 1', () => {
    renderPropertyCard({ beds: 1 });
    expect(screen.getByText('1 bed')).toBeInTheDocument();
  });

  it('displays plural "beds" when beds is greater than 1', () => {
    renderPropertyCard({ beds: 4 });
    expect(screen.getByText('4 beds')).toBeInTheDocument();
  });

  it('displays singular "bath" when baths is 1', () => {
    renderPropertyCard({ baths: 1 });
    expect(screen.getByText('1 bath')).toBeInTheDocument();
  });

  it('displays plural "baths" when baths is greater than 1', () => {
    renderPropertyCard({ baths: 3 });
    expect(screen.getByText('3 baths')).toBeInTheDocument();
  });

  it('renders all property details together', () => {
    renderPropertyCard({
      street: '789 Pine Road',
      city: 'Seattle',
      beds: 2,
      baths: 2,
      formattedPrice: '$750,000',
      propertyType: 'Townhouse',
    });

    expect(screen.getByText('789 Pine Road')).toBeInTheDocument();
    expect(screen.getByText('Seattle')).toBeInTheDocument();
    expect(screen.getByText('2 beds')).toBeInTheDocument();
    expect(screen.getByText('2 baths')).toBeInTheDocument();
    expect(screen.getByText('$750,000')).toBeInTheDocument();
    expect(screen.getByText('Townhouse')).toBeInTheDocument();
  });

  it('handles edge case of 0 beds correctly', () => {
    renderPropertyCard({ beds: 0 });
    expect(screen.getByText('0 bed')).toBeInTheDocument();
  });

  it('handles edge case of 0 baths correctly', () => {
    renderPropertyCard({ baths: 0 });
    expect(screen.getByText('0 bath')).toBeInTheDocument();
  });
});
