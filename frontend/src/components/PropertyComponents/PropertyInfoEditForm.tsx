import { PropertyResponse } from '../../types/dtos/PropertyResponse.dto';
import { PropertyEditProps } from '../../types/PropertyEditProps';
import EditableField from './EditableField';
import { PropertyTypes, PropertyStatuses } from '../../types/PropertyFormData';
import Button from '../GeneralComponents/Button';
import { useState } from 'react';

const PropertyInfoEditForm: React.FC<PropertyEditProps> = ({
  property,
  onFieldEdit,
}) => {
  const [editedFields, setEditedFields] = useState<Partial<PropertyResponse>>(
    {},
  );
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(
    null,
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleFieldEdit = (
    field: keyof PropertyResponse,
    value: string | number | null,
  ) => {
    setEditedFields((prev) => ({
      ...prev,
      [field]: value,
    }));

    onFieldEdit(field, value);
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
      className='bg-gray-50 flex-1 rounded-lg overflow-hidden h-fit w-full shadow-md py-6 pl-6 text-left'
    >
      <div className='space-y-2'>
        {editableFields.map(({ label, field, options }) => (
          <EditableField
            key={field}
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
        ))}
      </div>
      <Button text='Save changes' ClassName='mt-4 mx-auto' type='submit' />
      {message && (
        <div className='relative w-full flex justify-center mt-2'>
          <div
            className={`absolute -top-12 px-4 py-2 rounded-lg shadow transition-opacity duration-300
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
