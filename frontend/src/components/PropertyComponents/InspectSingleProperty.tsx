import { useEffect, useState } from 'react';
import { InspectSinglePropertyProps } from '../../types/InspectSinglePropertyProps';
import Button from '../GeneralComponents/Button';
import { IoArrowBack } from 'react-icons/io5';
import { ContactInfoReturnDto } from '../../../../backend/src/types/dtos/GetContactInfo.dto';
import formatPreferredContactMethod from '../../utils/formatPreferredContactMethod';
import formatPropertyType from '../../utils/formatPropertyTypes';
import formatPropertyStatus from '../../utils/formatPropertyStatus';
import { GetAllImagesForPropertyResponse } from '../../types/dtos/GetAllImagesForPropertyResponse.dto';

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
      const BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${BASE_URL}/info/getContactInfoForProperty?userId=${userId}`,
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
      const BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${BASE_URL}/property/getAllImagesForProperty?propertyId=${propertyId}`,
      );

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data: GetAllImagesForPropertyResponse = await response.json();

      setPictures(data.pictures);
    } catch {
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
    <div className='flex items-center flex-col'>
      <Button
        onClick={onClick}
        text='Back to browsing'
        icon={IoArrowBack}
        iconSize={18}
        ClassName='mt-2 mb-8'
      />
      <div className='flex flex-1 flex-col justify-center items-center mb-5 md:h-100 lg:h-200 xl:flex-row xl:gap-16 xl:max-w-7xl xl:mx-auto xl:px-4'>
        {/* Display images */}
        <div className='my-10 w-11/12 max-w-3xl flex-1 md:h-92 lg:w-full  lg:h-[30rem] xl:max-w-none xl:flex-shrink-0 xl:w-1/2'>
          <div className='mb-5 h-54 md:h-84 lg:h-100 aspect-video mx-auto xl:max-w-full rounded-md'>
            {displayImage ? (
              <img
                src={`data:image/jpeg;base64,${displayImage}`}
                alt='Selected Property'
                className='mx-auto rounded-lg flex-1 max-w-full max-h-full h-full object-cover shadow-sm shadow-slate-950'
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
              <div className='flex justify-center items-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                <p className='ml-3 text-gray-600'>
                  Loading additional pictures...
                </p>
              </div>
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
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 shadow-lg ${
                      displayImage === pic
                        ? 'border-blue-400'
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
        <div className='flex flex-col gap-2 lg:w-2xl xl:max-w-2xl xl:w-1/2'>
          {/* Basic Information */}
          <div className='bg-white dark:bg-slate-700 rounded-lg shadow-sm p-4'>
            <h2 className='border-b border-slate-400 text-xl font-semibold mb-4 pb-2'>
              Property Information
            </h2>
            <div className='space-y-3'>
              <div className='flex'>
                <span className='w-1/2 text-gray-600 dark:text-gray-400'>
                  Property type:
                </span>
                <span className='w-1/2 font-medium'>
                  {formatPropertyType(property.propertyType)}
                </span>
              </div>
              <div className='flex'>
                <span className='w-1/2 text-gray-600 dark:text-gray-400'>
                  Price:
                </span>
                <span className='w-1/2 text-green-400 dark:text-green-600 font-medium '>
                  {property.price.toLocaleString('fr-FR')} €
                </span>
              </div>
              <div className='flex'>
                <span className='w-1/2 text-gray-600 dark:text-gray-400'>
                  Bedrooms:
                </span>
                <span className='w-1/2 font-medium'>
                  {property.bedrooms}{' '}
                  {property.bedrooms > 1 ? 'bedrooms' : 'bedroom'}
                </span>
              </div>
              <div className='flex'>
                <span className='w-1/2 text-gray-600 dark:text-gray-400'>
                  Bathrooms:
                </span>
                <span className='w-1/2 font-medium'>
                  {property.bathrooms}{' '}
                  {property.bathrooms > 1 ? 'bathrooms' : 'bathroom'}
                </span>
              </div>
              <div className='flex'>
                <span className='w-1/2 text-gray-600 dark:text-gray-400'>
                  Square meters:
                </span>
                <span className='w-1/2 font-medium'>
                  {property.squareMeters} m²
                </span>
              </div>
              <div className='flex'>
                <span className='w-1/2 text-gray-600 dark:text-gray-400'>
                  Country:
                </span>
                <span className='w-1/2 font-medium'>{property.country}</span>
              </div>
              <div className='flex'>
                <span className='w-1/2 text-gray-600 dark:text-gray-400'>
                  State:
                </span>
                <span className='w-1/2 font-medium'>{property.state}</span>
              </div>
              <div className='flex'>
                <span className='w-1/2 text-gray-600 dark:text-gray-400'>
                  Street:
                </span>
                <span className='w-1/2 font-medium'>{property.street}</span>
              </div>
              {property.postalCode && (
                <div className='flex'>
                  <span className='w-1/2 text-gray-600 dark:text-gray-400'>
                    Postal code:
                  </span>
                  <span className='w-1/2 font-medium'>
                    {property.postalCode}
                  </span>
                </div>
              )}
              <div className='flex'>
                <span className='w-1/2 text-gray-600 dark:text-gray-400'>
                  Property status:
                </span>
                <span className='w-1/2 font-medium'>
                  {formatPropertyStatus(property.propertyStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* Description & Additional Info */}
          <div className='bg-white dark:bg-slate-700 rounded-lg shadow-sm p-4'>
            {property.additionalInfo ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-lg font-semibold mb-3 border-b border-slate-400 pb-2'>
                    Description
                  </h3>
                  <p className='leading-relaxed'>{property.description}</p>
                </div>
                <div>
                  <h3 className='text-lg font-semibold mb-3 border-b border-slate-400 pb-2'>
                    Additional Information
                  </h3>
                  <p className='leading-relaxed'>{property.additionalInfo}</p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className='text-lg font-semibold dark:text-gray-50 mb-3 border-b border-slate-400 pb-2'>
                  Description
                </h3>
                <p className=' leading-relaxed'>{property.description}</p>
              </div>
            )}
          </div>

          {/* Contact information */}
          <div className='bg-white dark:bg-slate-700 rounded-lg shadow-sm p-4'>
            <h3 className='text-lg font-semibold mb-4 border-b border-slate-400 pb-2'>
              Contact Information
            </h3>
            {loadingContact ? (
              <div className='flex justify-center items-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                <p className='ml-3 text-gray-600'>Loading contact info...</p>
              </div>
            ) : errorContact ? (
              <p className='text-red-500'>{errorContact}</p>
            ) : (
              <div className='space-y-3'>
                <div className='flex'>
                  <span className='w-1/3 text-gray-400'>Phone:</span>
                  <span className='w-2/3 font-medium'>
                    {propertySellerInfo?.phoneNumber}
                  </span>
                </div>
                <div className='flex'>
                  <span className='w-1/3 text-gray-400'>Email:</span>
                  <span className='w-2/3 font-medium'>
                    {propertySellerInfo?.email}
                  </span>
                </div>
                <div className='flex'>
                  <span className='w-1/3 text-gray-400'>
                    Preferred contact:
                  </span>
                  <span className='w-2/3 font-medium'>
                    {propertySellerInfo?.preferredContactMethod === null
                      ? 'Not specified'
                      : formatPreferredContactMethod(
                          propertySellerInfo?.preferredContactMethod,
                        )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectSingleProperty;
