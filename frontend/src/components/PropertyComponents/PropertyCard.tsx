import { FaBath, FaBed } from 'react-icons/fa6';
import { PropertyCardProps } from '../../types/PropertyCardProps';
import IconComponent from '../GeneralComponents/IconComponent';
import { IoLocation } from 'react-icons/io5';

const PropertyCard: React.FC<PropertyCardProps> = ({
  imageUrl,
  beds,
  baths,
  street,
  city,
  formattedPrice,
  propertyType,
}) => {
  return (
    <div className='rounded-lg overflow-hidden h-84 sm:h-98 min-w-56 shadow-md dark:shadow-none dark:ring-1 dark:ring-slate-600/50 dark:bg-slate-800/80 hover:scale-101 hover:dark:ring-slate-500 transition-all duration-200'>
      <div className='relative h-7/10 sm:h-8/10'>
        <img
          src={imageUrl}
          alt={`${propertyType} in ${street}, ${city}`}
          className='w-full h-full object-cover'
        />

        <div className='absolute top-3 right-3 bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-gray-300 bg-opacity-70 px-2 py-1 rounded-full text-sm font-medium'>
          {propertyType}
        </div>
      </div>

      <div className='bg-white dark:bg-slate-700/90 dark:text-slate-400 dark:border-t dark:border-slate-600 p-1 h-3/10 sm:h-3/10 md:h-2/10 lg:h-2/10'>
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center items-center mb-1'>
          <div className='flex items-center gap-1'>
            <IconComponent
              icon={IoLocation}
              size={16}
              className='dark:text-slate-400'
            />
            <strong className='dark:text-slate-100 text-sm'>{street}</strong>
            <span className='hidden sm:inline'>·</span>
          </div>
          <strong className='dark:text-slate-100 text-sm'>{city}</strong>
        </div>
        <p className='flex items-center justify-center gap-2'>
          <IconComponent icon={FaBed} size={16} />
          <span>
            {beds} {beds > 1 ? 'beds' : 'bed'}
          </span>
          <IconComponent icon={FaBath} size={16} />
          <span>
            {baths} {baths > 1 ? 'baths' : 'bath'}
          </span>
        </p>
        <p className='font-bold dark:font-normal dark:text-slate-100'>
          {formattedPrice}
        </p>
      </div>
    </div>
  );
};

export default PropertyCard;
