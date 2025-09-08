import { useState } from 'react';
import { EditProfileInfoFormData } from '../../types/EditProfileInfoFormData';
import InputField from '../GeneralComponents/InputField';

const EditProfileInfoForm = () => {
  const [formData, setFormData] = useState<EditProfileInfoFormData>({
    firstName: '',
    lastName: '',
    email: '',
  });

  // Handle editing information
  const handleInputChange =
    (field: keyof EditProfileInfoFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  return (
    <div className='sm:w-2/3 text-xs md:text-base'>
      <h2 className=''>Form</h2>
      <div className='flex flex-col gap-2'>
        <div>
          <label className='inline-block w-26'>First name: </label>
          <InputField
            type='text'
            placeholder='First name'
            value={formData.firstName}
            onChange={handleInputChange('firstName')}
            className='w-2/3'
          />
        </div>
        <div>
          <label className='inline-block w-26'>Last name: </label>
          <InputField
            type='text'
            placeholder='Last name'
            value={formData.lastName}
            onChange={handleInputChange('lastName')}
            className='w-2/3'
          />
        </div>
        <div>
          <label className='inline-block w-26'>Email: </label>
          <InputField
            type='text'
            placeholder='email'
            value={formData.email}
            onChange={handleInputChange('email')}
            className='w-2/3'
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfileInfoForm;
