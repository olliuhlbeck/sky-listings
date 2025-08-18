import { useEffect, useState } from 'react';
import { useAuth } from '../../utils/useAuth';
import { PropertyResponse } from '../../types/dtos/PropertyResponse.dto';
import PropertyInfoEditForm from '../../components/PropertyComponents/PropertyInfoEditForm';
import AdComponent from '../../components/GeneralComponents/AdComponent';
import { BiDollar } from 'react-icons/bi';
import Button from '../../components/GeneralComponents/Button';
import IconComponent from '../../components/GeneralComponents/IconComponent';
import { MdErrorOutline } from 'react-icons/md';

const MyProperties = () => {
  const [usersProperties, setUsersProperties] = useState<PropertyResponse[]>(
    [],
  );
  const [propertyToEdit, setPropertyToEdit] = useState<PropertyResponse | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [propertyerrorMessage, setPropertyErrorMessage] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  useState<boolean>(false);

  const { userId } = useAuth();

  // Fetch and display users properties on first render
  const fetchPropertiesByUserId = async (): Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:3000/property/getPropertiesByUserId?userId=${userId}`,
      );
      const data = await response.json();
      if (response.ok && data.usersProperties) {
        setUsersProperties(data.usersProperties);
        setErrorMessage('');
      }
    } catch {
      setErrorMessage('Failed to fetch your properties. Please try again.');
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

  const handleSingleFieldEdit = (
    field: keyof PropertyResponse,
    value: string | number | null,
  ) => {
    if (!propertyToEdit) {
      return;
    } else {
      setPropertyToEdit({
        ...propertyToEdit,
        [field]: value,
      });
    }
  };

  const gridCols =
    usersProperties.length === 1
      ? 'grid-cols-1'
      : usersProperties.length === 2
        ? 'grid-cols-2'
        : 'grid-cols-3';

  const handlePropertyDelete = async (propertyId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/property/delete/${propertyId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setUsersProperties((prev) =>
        prev.filter((property) => property.id !== propertyId),
      );
      if (propertyToEdit?.id === propertyId) {
        setPropertyToEdit(null);
      }
      setShowDeleteModal(false);
      setPropertyToEdit(null);
    } catch {
      setShowDeleteModal(false);
    }
  };

  const handlePropertyDeleteClickNoSelection = () => {
    setPropertyErrorMessage(
      'No property selected. Please select property to delete.',
    );
    setTimeout(() => {
      setPropertyErrorMessage('');
    }, 3000);
  };

  return (
    <>
      <div className='mt-10'>
        {loading && <p className=''>Loading your properties...</p>}
        {/* Error display */}
        {errorMessage !== '' && (
          <div className='flex justify-center gap-2 mt-5'>
            <IconComponent icon={MdErrorOutline} className='text-red-500' />
            <p className='text-red-500 mb-4'>{errorMessage}</p>
            <IconComponent icon={MdErrorOutline} className='text-red-500' />
          </div>
        )}
        {/* List properties */}
        <div className='flex flex-col justify-center mx-auto w-5/6 lg:flex-row lg:gap-10'>
          {loading === false && errorMessage === '' && (
            <>
              <div className='mb-6 flex-1'>
                <h2 className='mb-4'>Select property to edit information:</h2>
                {usersProperties && (
                  <div className={`grid ${gridCols} gap-4`}>
                    {usersProperties.map((property) => {
                      return (
                        <div
                          className={`bg-sky-200 rounded-md p-1 hover:bg-sky-300 hover:cursor-pointer transition duration-200 ${propertyToEdit?.id === property.id ? '!bg-blue-400' : ''}`}
                          key={property.id}
                          onClick={() => setPropertyToEdit({ ...property })}
                        >
                          {property.street}
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* Property deletion button */}
                {propertyerrorMessage !== '' ? (
                  <p className='text-red-500 mt-4'>{propertyerrorMessage}</p>
                ) : (
                  <Button
                    text='Delete selected property'
                    ClassName='!bg-red-200 hover:!bg-red-500 text-xs mt-4 mx-auto text-white hover:text-slate-900'
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.stopPropagation();
                      if (propertyToEdit) {
                        setShowDeleteModal(true);
                      } else {
                        handlePropertyDeleteClickNoSelection();
                      }
                    }}
                  />
                )}
              </div>
            </>
          )}
          {/* Render property edit form*/}
          {propertyToEdit !== null && (
            <PropertyInfoEditForm
              key={propertyToEdit.id}
              property={propertyToEdit}
              originalProperty={propertyToEdit}
              onFieldEdit={handleSingleFieldEdit}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && propertyToEdit && (
        <div
          className='fixed inset-0 flex items-center justify-center z-50'
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className='bg-white p-6 rounded shadow-lg w-80 max-w-full'
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-lg font-semibold mb-4'>Confirm Delete</h3>
            <p className='mb-4'>
              Are you sure you want to delete the property at{' '}
              <strong>{propertyToEdit.street}</strong>?
            </p>
            <div className='flex justify-end gap-4'>
              <Button
                type='button'
                onClick={async () => {
                  await handlePropertyDelete(propertyToEdit.id);
                }}
                ClassName='!px-4 !py-2 !rounded !bg-red-400 !text-white hover:!bg-red-600'
              >
                Delete
              </Button>
              <Button
                type='button'
                onClick={() => setShowDeleteModal(false)}
                ClassName='px-4 py-2 rounded hover:bg-gray-100'
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

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
