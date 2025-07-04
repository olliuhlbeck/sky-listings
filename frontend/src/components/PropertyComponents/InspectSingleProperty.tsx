import { PropertyResponse } from '../../types/dtos/PropertyResponse.dto';
import Button from '../GeneralComponents/Button';
import { IoArrowBack } from 'react-icons/io5';

interface InspectSinglePropertyProps {
  property: PropertyResponse;
  onClick?: () => void;
}

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
      {/* Test info */}
      <div>
        <div className='my-10'>Picture slot</div>

        <h2>Information slot</h2>
        <div>{property.bathrooms}</div>
        <div>{property.state}</div>
        <div>{property.street}</div>
        <div>{property.bedrooms}</div>
        <div>{property.country}</div>
      </div>
    </div>
  );
};

export default InspectSingleProperty;
