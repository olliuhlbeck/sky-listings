import { useState } from 'react';
import {
  PropertyFormData,
  PropertyStatuses,
  PropertyTypes,
} from '../../types/PropertyFormData';

const AddProperty: React.FC = () => {
  const [formData, setFormData] = useState<PropertyFormData>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    bedrooms: 0,
    bathrooms: 0,
    squaremeters: 0,
    description: '',
    additionalInfo: '',
    price: 0,
    propertyType: PropertyTypes.MISCELLANOUS,
    propertyStatus: PropertyStatuses.AVAILABLE,
    pictures: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'bedrooms' ||
        name === 'bathrooms' ||
        name === 'squaremeters' ||
        name === 'price'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
    <form
      id='addPropertyForm'
      onSubmit={handleSubmit}
      className='bg-gray-50  w-11/12 justify-center mt-6 p-4 mx-auto rounded-2xl shadow-md shadow-gray-500'
    >
      <h1 className='text-2xl font-semibold text-center mb-6'>
        Fill property information
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 [&>*]:flex-1 [&>*]:shadow-md [&>*]:rounded-md [&>*]:bg-sky-100 [&_h2]:text-xl [&_h2]:my-2 [&>*]:h-[17rem] mb-4'>
        <div>
          <h2 className='py-2'>Address</h2>
          <div className='flex flex-col space-y-2'>
            <div className='flex items-center'>
              <label htmlFor='street' className='w-1/3'>
                Street:
              </label>
              <input
                id='street'
                name='street'
                type='text'
                value={formData.street}
                onChange={handleChange}
                className='w-3/6 p-1 rounded-md shadow-sm bg-gray-50'
              />
            </div>
            <div className='flex items-center'>
              <label htmlFor='city' className='w-1/3'>
                City:
              </label>
              <input
                id='city'
                name='city'
                type='text'
                value={formData.city}
                onChange={handleChange}
                className='w-3/6 p-1 rounded-md shadow-sm bg-gray-50'
              />
            </div>
            <div className='flex items-center'>
              <label htmlFor='state' className='w-1/3'>
                State:
              </label>
              <input
                id='state'
                name='state'
                type='text'
                value={formData.state}
                onChange={handleChange}
                className='w-3/6 p-1 rounded-md shadow-sm bg-gray-50'
              />
            </div>
            <div className='flex items-center'>
              <label htmlFor='postalCode' className='w-1/3'>
                Postal code:
              </label>
              <input
                id='postalCode'
                name='postalCode'
                type='text'
                value={formData.postalCode}
                onChange={handleChange}
                className='w-3/6 p-1 rounded-md shadow-sm bg-gray-50'
              />
            </div>
            <div className='flex items-center'>
              <label htmlFor='country' className='w-1/3'>
                Country:
              </label>
              <input
                id='country'
                name='country'
                type='text'
                value={formData.country}
                onChange={handleChange}
                className='w-3/6 p-1 rounded-md shadow-sm bg-gray-50'
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className='py-2'>Property details</h2>
          <div className='flex flex-col space-y-2'>
            <div className='flex items-center'>
              <label htmlFor='price' className='w-1/2'>
                Price:
              </label>
              <input
                id='price'
                name='price'
                type='number'
                min={0}
                value={formData.price}
                onChange={handleChange}
                className='w-3/8 p-2 rounded-md shadow-sm bg-gray-50'
              />
            </div>
            <div className='flex items-center'>
              <label htmlFor='propertyType' className='w-1/2'>
                Property type:
              </label>
              <select
                id='propertyType'
                name='propertyType'
                value={formData.propertyType}
                onChange={handleChange}
                className='w-3/8 p-2 rounded-md shadow-sm bg-gray-50'
              >
                {Object.values(PropertyTypes).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex items-center'>
              <label htmlFor='propertyStatus' className='w-1/2'>
                Property status:
              </label>
              <select
                id='propertyStatus'
                name='propertyStatus'
                value={formData.propertyStatus}
                onChange={handleChange}
                className='w-3/8 p-2 rounded-md shadow-sm bg-gray-50'
              >
                {Object.values(PropertyStatuses).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className='py-2'>Basic info</h2>
          <div className='flex flex-col space-y-2'>
            <div className='flex items-center'>
              <label htmlFor='bedrooms' className='w-1/2'>
                Bedrooms:
              </label>
              <input
                type='number'
                id='bedrooms'
                name='bedrooms'
                min={0}
                max={10}
                value={formData.bedrooms}
                onChange={handleChange}
                className='w-1/6 p-2 rounded-md shadow-sm bg-gray-50'
              />
            </div>
            <div className='flex items-center'>
              <label htmlFor='bathrooms' className='w-1/2'>
                Bathrooms:
              </label>
              <input
                type='number'
                id='bathrooms'
                name='bathrooms'
                min={0}
                max={10}
                value={formData.bathrooms}
                onChange={handleChange}
                className='w-1/6 p-2 rounded-md shadow-sm bg-gray-50'
              />
            </div>
            <div className='flex items-center'>
              <label htmlFor='squaremeters' className='w-1/2'>
                Square meters:
              </label>
              <input
                type='number'
                id='squaremeters'
                name='squaremeters'
                min={0}
                value={formData.squaremeters}
                onChange={handleChange}
                className='w-1/6 p-2 rounded-md shadow-sm bg-gray-50'
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className='py-2'>Description</h2>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            className='bg-gray-50 text-gray-300 h-4/6 w-10/12 rounded-lg p-2 resize-none shadow-sm'
            placeholder='Enter description...'
          ></textarea>
        </div>

        <div>
          <h2 className='py-2'>Additional info</h2>
          <textarea
            id='additionalInfo'
            name='additionalInfo'
            value={formData.additionalInfo}
            onChange={handleChange}
            className='bg-gray-50 text-gray-300 h-4/6 w-10/12 rounded-lg p-2 resize-none shadow-sm'
            placeholder='Enter additional information...'
          ></textarea>
        </div>

        <div>
          <h2 className='py-2'>Pictures</h2>
        </div>
      </div>
      <div className='col-span-full flex justify-center !bg-gray-50 !shadow-none !h-10'>
        <button className='bg-sky-200 text-slate-900 px-6 py-2 rounded-md shadow-md hover:bg-sky-300'>
          Submit property
        </button>
      </div>
    </form>
  );
};

export default AddProperty;
