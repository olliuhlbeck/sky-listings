import { useEffect, useState } from 'react';
import { InspectSinglePropertyProps } from '../../types/InspectSinglePropertyProps';
import Button from '../GeneralComponents/Button';
import { IoArrowBack } from 'react-icons/io5';
import { ContactInfoReturnDto } from '../../../../backend/src/types/dtos/GetContactInfo.dto';
import formatPreferredContactMethod from '../../utils/formatPreferredContactMethod';
import formatPropertyType from '../../utils/formatPropertyTypes';
import formatPropertyStatus from '../../utils/formatPropertyStatus';

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
        ClassName='mt-2'
      />
      <div className='flex flex-1 flex-col justify-center items-center mb-5 md:h-100 lg:h-200 xl:flex-row xl:gap-10'>
        {/* Display images */}
        <div className='my-10 w-11/12 flex-1 lg:w-full md:h-92 lg:h-[30rem]'>
          <div className='mb-5 h-54 md:h-84 lg:h-100'>
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
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 shado ${
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

            <div className='flex w-full'>
              <span className='w-1/2 text-right pr-1'>Property type -</span>
              <span className='w-1/2 text-left pl-1'>
                {formatPropertyType(property.propertyType)}
              </span>
            </div>

            <div className='flex w-full'>
              <span className='w-1/2 text-right pr-1'>Price -</span>
              <span className='w-1/2 text-left pl-1'>
                {property.price.toLocaleString('fr-FR')} €
              </span>
            </div>

            <div className='flex w-full'>
              <span className='w-1/2 text-right pr-1'>Bedrooms -</span>
              <span className='w-1/2 text-left pl-1'>
                {property.bedrooms}{' '}
                {property.bedrooms > 1 ? 'bedrooms' : 'bedroom'}
              </span>
            </div>

            <div className='flex w-full'>
              <span className='w-1/2 text-right pr-1'>Bathrooms -</span>
              <span className='w-1/2 text-left pl-1'>
                {property.bathrooms}{' '}
                {property.bathrooms > 1 ? 'bathrooms' : 'bathroom'}
              </span>
            </div>

            <div className='flex w-full'>
              <span className='w-1/2 text-right pr-1'>Square meters -</span>
              <span className='w-1/2 text-left pl-1'>
                {property.squareMeters} m²
              </span>
            </div>

            <div className='flex w-full'>
              <span className='w-1/2 text-right pr-1'>Country -</span>
              <span className='w-1/2 text-left pl-1'>{property.country}</span>
            </div>

            <div className='flex w-full'>
              <span className='w-1/2 text-right pr-1'>State -</span>
              <span className='w-1/2 text-left pl-1'>{property.state}</span>
            </div>

            <div className='flex w-full'>
              <span className='w-1/2 text-right pr-1'>Street -</span>
              <span className='w-1/2 text-left pl-1'>{property.street}</span>
            </div>

            {property.postalCode && (
              <div className='flex w-full'>
                <span className='w-1/2 text-right pr-1'>Postal code -</span>
                <span className='w-1/2 text-left pl-1'>
                  {property.postalCode}
                </span>
              </div>
            )}

            <div className='flex w-full'>
              <span className='w-1/2 text-right pr-1'>Property status -</span>
              <span className='w-1/2 text-left pl-1'>
                {formatPropertyStatus(property.propertyStatus)}
              </span>
            </div>
          </div>
          <div className='flex justify-center items-stretch gap-x-2 mt-4'>
            <div className='rounded-md shadow-md bg-gray-50 w-full'>
              <h3 className='font-semibold my-2'>Description</h3>
              {property.description}
            </div>
            <div className='rounded-md shadow-md bg-gray-50 w-full'>
              <h3 className='font-semibold my-2'>Additional info</h3>
              {property.additionalInfo !== null ? (
                <p>{property.additionalInfo}</p>
              ) : (
                <p>No additional info given.</p>
              )}
            </div>
          </div>
          <div className='rounded-md shadow-md mt-4 bg-gray-50 w-full h-fit p-2'>
            <h3 className='font-semibold my-2'>Contact info</h3>
            {loadingContact ? (
              <p>Loading contact info...</p>
            ) : errorContact ? (
              <p className='text-red-600'>{errorContact}</p>
            ) : (
              <>
                <div className='flex w-full'>
                  <span className='w-1/2 text-right pr-1'>Phone -</span>
                  <span className='w-1/2 text-left pl-1'>
                    {propertySellerInfo?.phoneNumber}
                  </span>
                </div>

                <div className='flex w-full'>
                  <span className='w-1/2 text-right pr-1'>Email -</span>
                  <span className='w-1/2 text-left pl-1'>
                    {propertySellerInfo?.email}
                  </span>
                </div>

                <div className='flex w-full'>
                  <span className='w-1/2 text-right pr-1'>
                    Preferred contact style -
                  </span>
                  <span className='w-1/2 text-left pl-1'>
                    {propertySellerInfo?.preferredContactMethod === null
                      ? 'Preferred contact method not defined'
                      : formatPreferredContactMethod(
                          propertySellerInfo?.preferredContactMethod,
                        )}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectSingleProperty;
