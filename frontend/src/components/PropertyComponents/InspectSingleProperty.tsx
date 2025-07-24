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
  const [displayImage, setDisplayImage] = useState<string | null>(
    property.coverPicture || null,
  );

  const [pictures, setPictures] = useState<string[] | null>(null);
  const [loadingContact, setLoadingContact] = useState<boolean>(false);
  const [loadingPictures, setLoadingPictures] = useState<boolean>(false);
  const [errorContact, setErrorContact] = useState<string | null>(null);
  const [errorPictures, setErrorPictures] = useState<string | null>(null);

  const fetchUserInfo = async (): Promise<void> => {
    if (!property.userId) {
      return;
    }

    setLoadingContact(true);
    setErrorContact(null);

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
      setErrorContact('Failed to load contact info. Please try again.');
    } finally {
      setLoadingContact(false);
    }
  };

  const fetchImages = async (): Promise<void> => {
    if (!property.id) {
      return;
    }

    setLoadingPictures(true);
    setErrorPictures(null);

    try {
      const propertyId = property.id;
      const response = await fetch(
        `http://localhost:3000/property/getAllImagesForProperty?propertyId=${propertyId}`,
      );

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();

      setPictures(data.pictures);
    } catch (error) {
      console.error(error);
      setErrorPictures('Failed to load more pictures. Please try again.');
    } finally {
      setLoadingPictures(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchImages();
  }, [property.userId, property.id]);

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
        <div className='my-10 w-11/12 flex-1 lg:w-1/2 md:h-92 lg:h-[30rem]'>
          <div className='mb-5 h-54 md:h-84 lg:h-full'>
            {displayImage ? (
              <img
                src={`data:image/jpeg;base64,${displayImage}`}
                alt='Selected Property'
                className='mx-auto rounded-lg flex-1 shadow-md max-w-full max-h-full h-full object-cover'
              />
            ) : (
              <div className='w-80 h-60 flex items-center justify-center bg-gray-200 rounded-xl'>
                <p>No image available</p>
              </div>
            )}
          </div>
          {/* Additional Images Info */}
          <div className=''>
            {loadingPictures ? (
              <p>Loading pictures...</p>
            ) : errorPictures ? (
              <p className='text-red-600'>{errorPictures}</p>
            ) : pictures && pictures.length > 0 ? (
              <div className='flex flex-wrap gap-2 justify-center'>
                {pictures.map((pic, index) => (
                  <img
                    key={`selectedPictureForDisplay${index}`}
                    src={`data:image/jpeg;base64,${pic}`}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setDisplayImage(pic)}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                      displayImage === pic
                        ? 'border-blue-500'
                        : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <p>No additional pictures available.</p>
            )}
          </div>
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
            {loadingContact ? (
              <p>Loading contact info...</p>
            ) : errorContact ? (
              <p className='text-red-600'>{errorContact}</p>
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
