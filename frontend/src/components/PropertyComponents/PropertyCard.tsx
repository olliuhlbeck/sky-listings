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
    <div className='rounded-lg overflow-hidden h-66 md:h-92 lg:h-96 shadow-md'>
      <div
        className='h-8/10 bg-cover bg-center'
        style={{ backgroundImage: `url(${imageUrl})` }}
        role='img'
      ></div>

      <div className='p-1 bg-white h-2/10'>
        <div className='text-sm text-gray-600'>
          {beds} beds • {baths} baths
        </div>
        <div className='font-semibold'>{street}</div>
        <div className='text-lg font-bold'>{formattedPrice}</div>
      </div>
    </div>
  );
};

export default PropertyCard;
