import { PropertyResponse } from '../../types/dtos/PropertyResponse.dto';
import { PropertyEditProps } from '../../types/PropertyEditProps';
import EditableField from './EditableField';
import { PropertyTypes, PropertyStatuses } from '../../types/PropertyFormData';
import Button from '../GeneralComponents/Button';
import { useEffect, useState } from 'react';
import { RiResetLeftLine } from 'react-icons/ri';
import { useAuth } from '../../utils/useAuth';
import IconComponent from '../GeneralComponents/IconComponent';
import { BiSolidEdit } from 'react-icons/bi';

const PropertyInfoEditForm: React.FC<PropertyEditProps> = ({ property }) => {
  const [editedFields, setEditedFields] = useState<Partial<PropertyResponse>>(
    {},
  );
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(
    null,
  );
  const [message, setMessage] = useState<string | null>(null);

  const { token } = useAuth();

  const handleFieldEdit = (
    field: keyof PropertyResponse,
    value: string | number | null,
  ) => {
    setEditedFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    setEditedFields({});
    setMessage(null);
    setMessageType(null);
  }, [property]);

  const resetForm = () => {
    setEditedFields({});
    setMessage(null);
    setMessageType(null);
  };

  // Fields to map for edit form
  const editableFields: {
    label: string;
    field: keyof Pick<
      PropertyResponse,
      | 'street'
      | 'city'
      | 'state'
      | 'country'
      | 'postalCode'
      | 'price'
      | 'bedrooms'
      | 'bathrooms'
      | 'squareMeters'
      | 'propertyType'
      | 'propertyStatus'
      | 'description'
      | 'additionalInfo'
      | 'coverPicture'
    >;
    options?: string[];
  }[] = [
    { label: 'Street', field: 'street' },
    { label: 'City', field: 'city' },
    { label: 'State', field: 'state' },
    { label: 'Country', field: 'country' },
    { label: 'Postal Code', field: 'postalCode' },
    { label: 'Price', field: 'price' },
    { label: 'Bedrooms', field: 'bedrooms' },
    { label: 'Bathrooms', field: 'bathrooms' },
    { label: 'Square Meters', field: 'squareMeters' },
    {
      label: 'Type',
      field: 'propertyType',
      options: Object.values(PropertyTypes),
    },
    {
      label: 'Status',
      field: 'propertyStatus',
      options: Object.values(PropertyStatuses),
    },
    { label: 'Description', field: 'description' },
    { label: 'Additional Info', field: 'additionalInfo' },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Object.keys(editedFields).length > 0) {
      try {
        const response = await fetch(
          `http://localhost:3000/property/editPropertyInformation/${property.id}`,
          {
            method: 'PUT',

            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editedFields),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to update property');
        }
        setMessageType('success');
        setMessage('Property updated successfully!');
        setTimeout(() => setMessage(null), 3000);
      } catch {
        setMessageType('error');
        setMessage('Error updating property.');

        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 3000);
      }
    } else {
      setMessageType('error');
      setMessage('No edited fields found.');
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white dark:bg-slate-900 flex-1 rounded-lg overflow-hidden w-full shadow-sm border border-gray-200 relative'
    >
      <div className='flex justify-between items-center p-2 sm:p-4 border-b border-gray-200 bg-linear-to-r from-cyan-500 dark:from-cyan-800 to-blue-600'>
        <h3 className='flex justify-center items-center gap-2 text-lg font-medium text-gray-50 dark:text-slate-950 mx-auto'>
          <IconComponent icon={BiSolidEdit} />
          Edit Property
        </h3>
        {/* Reset button */}
        <Button
          iconSize={18}
          ClassName='!p-2 hover:!bg-red-100 !text-gray-600 dark:!text-gray-50 dark:hover:!bg-red-600'
          icon={RiResetLeftLine}
          onClick={resetForm}
        />
      </div>
      {/* Editable fields */}
      <div className='p-4 sm:p-6'>
        {editableFields.map(({ label, field, options }) => (
          <div key={field} className='w-full mb-2'>
            <EditableField
              label={`${label}:`}
              field={field}
              value={
                editedFields[field] !== undefined
                  ? editedFields[field]
                  : property[field]
              }
              onEdit={handleFieldEdit}
              options={options}
            />
          </div>
        ))}
      </div>

      {/* Submit button */}
      <Button text='Save changes' ClassName='mx-auto mb-4' type='submit' />

      {/* Message display */}
      {message && (
        <div className='relative w-full flex justify-center mt-2'>
          <div
            className={`absolute -top-12 xl:-top-15 px-4 py-3 rounded-lg shadow transition-opacity duration-300
        ${
          messageType === 'success'
            ? 'bg-green-100 border border-green-300 text-green-500'
            : 'bg-red-100 border border-red-300 text-red-500'
        }
      `}
          >
            {message}
          </div>
        </div>
      )}
    </form>
  );
};

export default PropertyInfoEditForm;
