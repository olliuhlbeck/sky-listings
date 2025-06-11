import { useEffect, useState } from 'react';
import { useAuth } from '../../utils/useAuth';
import { PropertyResponse } from '../../types/dtos/PropertyResponse.dto';
import PropertyInfoEditForm from '../../components/PropertyComponents/PropertyInfoEditForm';
import AdComponent from '../../components/GeneralComponents/AdComponent';
import { BiDollar } from 'react-icons/bi';

const MyProperties = () => {
  const [usersProperties, setUsersProperties] = useState<PropertyResponse[]>(
    [],
  );
  const [propertyToEdit, setPropertyIdToEdit] =
    useState<PropertyResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { userId } = useAuth();

  const fetchPropertiesByUserId = async (): Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:3000/property/getPropertiesByUserId?userId=${userId}`,
      );
      const data = await response.json();
      if (response.ok && data.usersProperties) {
        setUsersProperties(data.usersProperties);
        setErrorMessage('');
        console.log(data.usersProperties);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch your properties. Please try again.');
      console.error(error);
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId !== null && userId !== undefined) {
      fetchPropertiesByUserId();
    }
  }, [userId]);

  return (
    <>
      <div className='mt-10'>
        {loading && <p className=''>Loading your properties...</p>}
        {errorMessage !== '' && (
          <p className='text-red-500 mb-4'>{errorMessage}</p>
        )}
        <div className='flex flex-col justify-center mx-auto w-5/6 lg:flex-row lg:gap-10'>
          {loading === false && errorMessage === '' && (
            <div className='mb-6 flex-1'>
              <h2 className='mb-4'>Select property to edit:</h2>
              {usersProperties && (
                <div className='grid grid-cols-3 gap-4'>
                  {usersProperties.map((property, propertyIndex) => {
                    return (
                      <div
                        className={`bg-sky-200 rounded-md p-1 hover:bg-sky-300 hover:cursor-pointer transition duration-200 ${propertyToEdit?.id === property.id ? '!bg-blue-400' : ''}`}
                        key={`myProperties${propertyIndex}`}
                        onClick={() => setPropertyIdToEdit(property)}
                      >
                        {property.street}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {propertyToEdit !== null && (
            <PropertyInfoEditForm property={propertyToEdit} />
          )}
        </div>
      </div>
      <AdComponent
        title='Mortgage Masters'
        message='Short on liquid assets? Mortgage Masters can solve your problems!'
        buttonText='Apply for loan'
        icon={BiDollar}
        addToClassName='mt-20 mx-auto'
      />
    </>
  );
};

export default MyProperties;
