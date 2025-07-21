import { useEffect, useState } from 'react';
import { InspectSinglePropertyProps } from '../../types/InspectSinglePropertyProps';
import Button from '../GeneralComponents/Button';
import { IoArrowBack } from 'react-icons/io5';
import { ContactInfoReturnDto } from '../../../../backend/src/types/dtos/GetContactInfo.dto';

const InspectSingleProperty: React.FC<InspectSinglePropertyProps> = ({
  property,
  onClick,
}) => {
  const [propertySellerInfo, setPropertySellerInfo] =
    useState<ContactInfoReturnDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async (): Promise<void> => {
    if (!property.userId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = property.userId;
      const response = await fetch(
        `http://localhost:3000/contactInfo/getContactInfoForProperty?userId=${userId}`,
      );

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data: ContactInfoReturnDto = await response.json();
      setPropertySellerInfo(data);
    } catch {
      setError('Failed to load contact info. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [property.userId]);

  return (
    <div className='flex items-center justify-center flex-col'>
      <Button
        onClick={onClick}
        text='Back to browsing'
        icon={IoArrowBack}
        iconSize={18}
      />
      <div className='flex flex-1 flex-col lg:flex-row lg:gap-8 justify-center items-center mb-10 md:h-100 lg:h-full'>
        {/* Display images */}
        <div className='my-10 w-11/12 flex-1 lg:w-1/2 md:h-92 lg:h-full'>
          {property.coverPicture ? (
            <img
              src={`data:image/jpeg;base64,${property.coverPicture}`}
              alt='Property'
              className='rounded-lg flex-1 shadow-md max-w-full max-h-full h-full object-cover'
            />
          ) : (
            <div className='w-80 h-60 flex items-center justify-center bg-gray-200 rounded-xl'>
              <p>No image available</p>
            </div>
          )}
        </div>
        {/* Display information */}
        <div className='w-11/12 flex-1 md:h-100  lg:h-full lg:my-10 xl:w-1/2 justify-center'>
          <div className='rounded-md bg-gray-50 shadow-sm lg:shadow-md [&>div]:my-1 p-1'>
            <h2 className='font-bold my-2'>Property information</h2>
            <div>Property type - {property.propertyType} </div>
            <div>Price - {`${property.price.toLocaleString('fr-FR')} €`} </div>
            <div>
              {property.bedrooms}{' '}
              {property.bedrooms > 1 ? 'bedrooms' : 'bedroom'} -{' '}
              {property.bathrooms}
              {property.bathrooms > 1 ? ' bathrooms' : ' bathroom'}
            </div>
            <div>Square meters - {property.squareMeters}</div>
            <div>Country - {property.country}</div>
            <div>State - {property.state}</div>
            <div>Street - {property.street}</div>
            {property.postalCode && (
              <div>Postal code - {property.postalCode}</div>
            )}
            <div>Property status - {property.propertyStatus}</div>
          </div>
          <div className='flex justify-center gap-x-2 mt-4'>
            <div className='rounded-md shadow-md bg-gray-50 w-full h-fit'>
              <h3 className='font-semibold my-2'>Description</h3>
              {property.description}
            </div>
            <div className='rounded-md shadow-md bg-gray-50 w-full h-fit'>
              <h3 className='font-semibold my-2'>Additional info</h3>
              {property.additionalInfo !== null ? (
                <p>{property.additionalInfo}</p>
              ) : (
                <p>No additional info given.</p>
              )}
            </div>
          </div>
          <div className='rounded-md shadow-md mt-4 bg-gray-50 w-full h-fit'>
            <h3 className='font-semibold my-2'>Contact info</h3>
            {loading ? (
              <p>Loading contact info...</p>
            ) : error ? (
              <p className='text-red-600'>{error}</p>
            ) : (
              <>
                <p>Phone - {propertySellerInfo?.phoneNumber}</p>
                <p>Email - {propertySellerInfo?.email}</p>
                <p>
                  Preferred contact style -{' '}
                  {propertySellerInfo?.preferredContactMethod}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectSingleProperty;
