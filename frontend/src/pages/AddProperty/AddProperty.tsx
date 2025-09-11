import { useState } from 'react';
import {
  PropertyFormData,
  PropertyStatuses,
  PropertyTypes,
} from '../../types/PropertyFormData';
import IconComponent from '../../components/GeneralComponents/IconComponent';
import { BiCamera } from 'react-icons/bi';
import Button from '../../components/GeneralComponents/Button';
import { BsHouseUp } from 'react-icons/bs';
import { useAuth } from '../../utils/useAuth';
import { CreatePropertyResponse } from '../../types/dtos/CreatePropertyResponse';
import { GeneralErrorResponse } from '../../types/dtos/GeneralErrorResponse';

const AddProperty: React.FC = () => {
  const [formData, setFormData] = useState<PropertyFormData>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    bedrooms: 0,
    bathrooms: 0,
    squareMeters: 0,
    description: '',
    additionalInfo: '',
    price: 0,
    propertyType: PropertyTypes.MISCELLANEOUS,
    propertyStatus: PropertyStatuses.AVAILABLE,
    pictures: [],
    coverPictureIndex: 0,
  });
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(
    null,
  );
  const [message, setMessage] = useState<string | null>(null);

  const { token } = useAuth();

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
        name === 'squareMeters' ||
        name === 'price'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formDataToSend = new FormData();

    // Pack all but pictures into payload
    for (const [key, value] of Object.entries(formData)) {
      if (key === 'pictures') continue;

      if (value !== undefined) {
        formDataToSend.append(key, String(value));
      }
    }
    // Pack Pictures into payload
    formData.pictures.forEach((file) => {
      formDataToSend.append('pictures', file, file.name);
    });

    try {
      const BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${BASE_URL}/property/addProperty`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: CreatePropertyResponse | GeneralErrorResponse =
        await response.json();

      if (!response.ok) {
        setMessageType('error');
        if ('error' in data) {
          setMessage(data.error);
        } else {
          setMessage('An error occurred');
        }
        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 3000);
        return;
      }
      setFormData({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        bedrooms: 0,
        bathrooms: 0,
        squareMeters: 0,
        description: '',
        additionalInfo: '',
        price: 0,
        propertyType: PropertyTypes.MISCELLANEOUS,
        propertyStatus: PropertyStatuses.AVAILABLE,
        pictures: [],
        coverPictureIndex: 0,
      });
      setMessageType('success');
      setMessage('Property created successfully.');
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 3000);
      return;
    } catch (error) {
      setMessageType('error');
      setMessage(`${error}`);
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 3000);
      return;
    }
  };

  return (
    <form
      id='addPropertyForm'
      onSubmit={handleSubmit}
      className='bg-linear-to-r from-sky-500 to-blue-200 dark:from-sky-950 dark:to-blue-800 w-11/12 min-w-3xs justify-center mt-10 p-4 mx-auto rounded-2xl shadow-md shadow-gray-500 dark:shadow-slate-700'
    >
      <h1 className='text-2xl font-semibold text-center mb-3 md:mb-6'>
        Property information
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 [&>*]:flex-1 [&>*]:shadow-md [&>*]:rounded-md [&>*]:bg-sky-100 [&_h2]:text-xl  [&_h2]:my-2 [&>*]:h-[17rem] mb-4'>
        <div className='dark:!bg-slate-800 pl-6 sm:pl-10'>
          <h2 className='py-0 sm:py-2'>Address</h2>
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
                className='w-28 sm:w-1/2 p-1 rounded-md shadow-sm bg-gray-50 dark:text-slate-900'
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
                className='w-28 sm:w-1/2 p-1 rounded-md shadow-sm bg-gray-50 dark:text-slate-900'
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
                className='w-28 sm:w-1/2 p-1 rounded-md shadow-sm bg-gray-50 dark:text-slate-900'
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
                className='w-28 sm:w-1/2 p-1 rounded-md shadow-sm bg-gray-50 dark:text-slate-900'
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
                className='w-28 sm:w-1/2 p-1 rounded-md shadow-sm bg-gray-50 dark:text-slate-900'
                autoComplete='country'
              />
            </div>
          </div>
        </div>

        <div className='dark:!bg-slate-800'>
          <h2 className='py-0 sm:py-2'>Property details</h2>
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
                className='w-3/8 p-2 rounded-md shadow-sm bg-gray-50 dark:text-slate-900 dark:text-slate-900'
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
                className='w-3/8 p-2 rounded-md shadow-sm bg-gray-50 dark:text-slate-900 dark:text-slate-900'
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
                className='w-3/8 p-2 rounded-md shadow-sm bg-gray-50 dark:text-slate-900 dark:text-slate-900'
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

        <div className='dark:!bg-slate-800'>
          <h2 className='py-0 sm:py-2'>Basic info</h2>
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
                className='w-2/6 p-2 rounded-md shadow-sm bg-gray-50 dark:text-slate-900'
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
                className='w-2/6 p-2 rounded-md shadow-sm bg-gray-50 dark:text-slate-900'
              />
            </div>
            <div className='flex items-center'>
              <label htmlFor='squareMeters' className='w-1/2'>
                Square meters:
              </label>
              <input
                type='number'
                id='squareMeters'
                name='squareMeters'
                min={0}
                value={formData.squareMeters}
                onChange={handleChange}
                className='w-2/6 p-2 rounded-md shadow-sm bg-gray-50 dark:text-slate-900'
              />
            </div>
          </div>
        </div>

        <div className='dark:!bg-slate-800'>
          <h2 className='py-2'>Description</h2>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            className='bg-gray-50 text-gray-300 dark:text-slate-900 h-4/6 w-10/12 rounded-lg p-2 resize-none shadow-sm'
            placeholder='Enter description...'
          ></textarea>
        </div>

        <div className='dark:!bg-slate-800'>
          <h2 className='py-0 sm:py-2'>Additional info</h2>
          <textarea
            id='additionalInfo'
            name='additionalInfo'
            value={formData.additionalInfo}
            onChange={handleChange}
            className='bg-gray-50 text-gray-300 dark:text-slate-900 h-4/6 w-10/12 rounded-lg p-2 resize-none shadow-sm'
            placeholder='Enter additional information...'
          ></textarea>
        </div>

        <div className='flex flex-col items-center dark:!bg-slate-800'>
          <h2 className='py-0 sm:py-2'>Pictures</h2>
          <label
            htmlFor='pictures'
            className='flex min-w-40 mx-auto items-center justify-center px-4 py-2 mb-2 bg-sky-200 dark:bg-blue-800 text-slate-900 dark:text-gray-50 rounded-md shadow-md cursor-pointer hover:bg-sky-300 dark:hover:bg-blue-700 transition duration-200'
          >
            <IconComponent icon={BiCamera} className='mr-3' />
            Upload images
          </label>
          <input
            type='file'
            id='pictures'
            name='pictures'
            multiple
            accept='image/jpeg'
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;

              const newFiles = Array.from(files).filter((file) => {
                return file.type === 'image/jpeg';
              });

              setFormData((prev) => ({
                ...prev,
                pictures: [...(prev.pictures ?? []), ...newFiles],
              }));
            }}
            hidden
            className=' bg-gray-50 text-gray-900 p-2 rounded shadow-sm hover:cursor-pointer'
          />

          {formData.pictures && formData.pictures.length > 0 && (
            <h2 className='!text-sm !mt-2'>Choose cover picture:</h2>
          )}

          <div className='flex flex-wrap gap-2 mt-2'>
            {formData.pictures &&
              formData.pictures.map((file, idx) => (
                <div key={idx} className='flex flex-col items-center'>
                  <label className='flex flex-col items-center space-y-1 mt-1 text-sm'>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx}`}
                      className='w-16 h-16 object-cover rounded shadow'
                    />
                    <input
                      type='radio'
                      name='mainPicture'
                      checked={formData.coverPictureIndex === idx}
                      className=' hover:cursor-pointer'
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          coverPictureIndex: idx,
                        }))
                      }
                    ></input>
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className='relative w-full flex flex-col items-center mt-4 min-h-[3rem]'>
        {message && (
          <div
            className={`absolute px-4 py-2 rounded-lg shadow transition-opacity duration-300
        ${
          messageType === 'success'
            ? 'bg-green-100 border border-green-300 text-green-600'
            : 'bg-red-100 border border-red-300 text-red-600'
        }`}
          >
            {message}
          </div>
        )}

        <Button
          text='Add property'
          type='submit'
          ClassName='mx-auto dark:hover:bg-blue-700'
          icon={BsHouseUp}
        />
      </div>
    </form>
  );
};

export default AddProperty;
