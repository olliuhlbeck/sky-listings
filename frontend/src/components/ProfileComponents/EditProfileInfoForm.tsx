import { useState } from 'react';
import { EditProfileInfoFormData } from '../../types/EditProfileInfoFormData';
import InputField from '../GeneralComponents/InputField';
const EditProfileInfoForm = () => {
  const [formData, setFormData] = useState<EditProfileInfoFormData>({
    address: '',
    email: '',
    firstName: '',
    lastName: '',
    preferredContactMethod: 'NOTCHOSEN',
  });

  // Handle editing input controller information
  const handleInputChange =
    (field: keyof EditProfileInfoFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  // Handle select change for preferred contact
  const handleSelectChange =
    (field: keyof EditProfileInfoFormData) =>
    (event: React.ChangeEvent<HTMLSelectElement>): void => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  return (
    <div className='sm:w-2/3 text-xs md:text-base'>
      <div className='flex flex-col gap-2'>
        <div>
          <label className='inline-block w-40 lg:w-60'>First name: </label>
          <InputField
            type='text'
            placeholder='First name'
            value={formData.firstName}
            onChange={handleInputChange('firstName')}
            className='w-2/3 bg-white'
          />
        </div>
        <div>
          <label className='inline-block w-40 lg:w-60'>Last name: </label>
          <InputField
            type='text'
            placeholder='Last name'
            value={formData.lastName}
            onChange={handleInputChange('lastName')}
            className='w-2/3 bg-white'
          />
        </div>
        <div>
          <label className='inline-block w-40 lg:w-60'>Email: </label>
          <InputField
            type='text'
            placeholder='Email'
            value={formData.email}
            onChange={handleInputChange('email')}
            className='w-2/3 bg-white'
          />
        </div>
        <div>
          <label className='inline-block w-40 lg:w-60'>Address: </label>
          <InputField
            type='text'
            placeholder='Address'
            value={formData.address}
            onChange={handleInputChange('address')}
            className='w-2/3 bg-white'
          />
        </div>
        <div>
          <label className='inline-block w-40 md:w-60'>
            Preferred contact style:{' '}
          </label>
          <select
            value={formData.preferredContactMethod}
            onChange={handleSelectChange('preferredContactMethod')}
            className='w-2/3 bg-white px-3 py-2 border border-gray-300 rounded-md dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900'
          >
            <option value='notChosen' className='text-center'>
              Not chosen
            </option>
            <option value='email' className='text-center'>
              Email
            </option>
            <option value='phone' className='text-center'>
              Phone call
            </option>
            <option value='sms' className='text-center'>
              Text message
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EditProfileInfoForm;
