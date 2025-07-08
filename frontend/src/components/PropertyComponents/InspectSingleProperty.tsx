import { InspectSinglePropertyProps } from '../../types/InspectSinglePropertyProps';
import Button from '../GeneralComponents/Button';
import { IoArrowBack } from 'react-icons/io5';

const InspectSingleProperty: React.FC<InspectSinglePropertyProps> = ({
  property,
  onClick,
}) => {
  return (
    <div className='flex items-center justify-center flex-col'>
      <Button
        onClick={onClick}
        text='Back to browsing'
        icon={IoArrowBack}
        iconSize={18}
      />
      <div className='flex flex-1 flex-col lg:flex-row justify-center items-center gap-8'>
        {/* Display images */}
        <div className='my-10'>
          {property.coverPicture ? (
            <img
              src={`data:image/jpeg;base64,${property.coverPicture}`}
              alt='Property'
              className='rounded-lg shadow-md max-w-full max-h-[400px] object-cover'
            />
          ) : (
            <div className='w-80 h-60 flex items-center justify-center bg-gray-200 rounded-xl'>
              <p>No image available</p>
            </div>
          )}
        </div>
        {/* Display information */}
        <div>
          <h2>Information slot</h2>
          <div>{property.bathrooms}</div>
          <div>{property.state}</div>
          <div>{property.street}</div>
          <div>{property.bedrooms}</div>
          <div>{property.country}</div>
        </div>
      </div>
    </div>
  );
};

export default InspectSingleProperty;
