import { PropertyResponse } from '../../types/dtos/PropertyResponse.dto';

interface PropertyEditProps {
  property: PropertyResponse;
}
const PropertyInfoEditForm: React.FC<PropertyEditProps> = ({ property }) => {
  return (
    <div className='bg-gray-50 flex-1 rounded-lg overflow-hidden h-fit w-full shadow-md py-6 pl-6 text-left'>
      <div className='space-y-1'>
        <div>
          <strong>Street:</strong> {property.street}
        </div>
        <div>
          <strong>City:</strong> {property.city}
        </div>
        <div>
          <strong>State:</strong> {property.state}
        </div>
        <div>
          <strong>Country:</strong> {property.country}
        </div>
        <div>
          <strong>Postal Code:</strong> {property.postalCode || 'N/A'}
        </div>
        <div>
          <strong>Price:</strong> ${property.price.toLocaleString()}
        </div>
        <div>
          <strong>Bedrooms:</strong> {property.bedrooms}
        </div>
        <div>
          <strong>Bathrooms:</strong> {property.bathrooms}
        </div>
        <div>
          <strong>Square Meters:</strong> {property.squareMeters} m²
        </div>
        <div>
          <strong>Type:</strong> {property.propertyType}
        </div>
        <div>
          <strong>Status:</strong> {property.propertyStatus}
        </div>
        <div>
          <strong>Description:</strong> {property.description}
        </div>
        <div>
          <strong>Additional Info:</strong> {property.additionalInfo || 'N/A'}
        </div>
        <div>
          <strong>Cover Picture:</strong> {property.coverPicture || 'None'}
        </div>
      </div>
    </div>
  );
};

export default PropertyInfoEditForm;
