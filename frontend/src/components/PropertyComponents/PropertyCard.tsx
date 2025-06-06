export interface PropertyCardProps {
  imageUrl: string;
  beds: number;
  baths: number;
  street: string;
  formattedPrice: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  imageUrl,
  beds,
  baths,
  street,
  formattedPrice,
}) => {
  return (
    <div className='rounded-lg overflow-hidden h-64 md:h-92 lg:h-96 shadow-md'>
      <div
        className='h-7/10 md:h-8/10 bg-cover bg-center'
        style={{ backgroundImage: `url(${imageUrl})` }}
        role='img'
      ></div>

      <div className='p-1 bg-white h-3/10 md:h-2/10 '>
        <div className='text-sm text-gray-600'>
          {beds} {beds > 1 ? 'beds' : 'bed'} • {baths}{' '}
          {baths > 1 ? 'baths' : 'bath'}
        </div>
        <div className='font-semibold'>{street}</div>
        <div className='text-lg font-bold'>{formattedPrice}</div>
      </div>
    </div>
  );
};

export default PropertyCard;
