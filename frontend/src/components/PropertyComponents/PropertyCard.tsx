import { FaBath, FaBed } from 'react-icons/fa6';
import { PropertyCardProps } from '../../types/PropertyCardProps';
import IconComponent from '../GeneralComponents/IconComponent';
import { IoLocation } from 'react-icons/io5';

const PropertyCard: React.FC<PropertyCardProps> = ({
  imageUrl,
  beds,
  baths,
  street,
  formattedPrice,
  propertyType,
}) => {
  return (
    <div className='rounded-lg overflow-hidden h-72 md:h-92 lg:h-96 shadow-md hover:scale-101 transition duration-200'>
      <div
        className='h-7/10 md:h-8/10 bg-cover bg-center relative'
        style={{ backgroundImage: `url(${imageUrl})` }}
        role='img'
      >
        <div className='absolute top-3 right-3 bg-gray-50 text-slate-900 bg-opacity-70 px-2 py-1 rounded-full text-sm font-medium'>
          {propertyType}
        </div>
      </div>

      <div className='p-1 bg-white h-3/10 md:h-2/10 '>
        <div className='flex gap-2 justify-center items-center'>
          <IconComponent icon={IoLocation} size={16} />
          <strong>{street}</strong>
        </div>
        <p className='flex justify-center items-center gap-4'>
          <IconComponent icon={FaBed} size={16} />
          {beds} {beds > 1 ? 'beds' : 'bed'}
          <IconComponent icon={FaBath} size={16} />
          {baths}
          {baths > 1 ? ' baths' : ' bath'}
        </p>
        <p className='font-bold'>{formattedPrice}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
