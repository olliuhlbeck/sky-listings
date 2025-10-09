import { useEffect, useState } from 'react';
import { EditProfileInfoFormData } from '../../types/EditProfileInfoFormData';
import InputField from '../GeneralComponents/InputField';
import { useAuth } from '../../utils/useAuth';
import IconComponent from '../GeneralComponents/IconComponent';
import { MdErrorOutline } from 'react-icons/md';
import Button from '../GeneralComponents/Button';
import { FaRegSave } from 'react-icons/fa';
import { RiResetLeftLine } from 'react-icons/ri';
const EditProfileInfoForm = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [formData, setFormData] = useState<EditProfileInfoFormData>({
    address: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    preferredContactMethod: 'NOTCHOSEN',
  });
  const [originalData, setOriginalData] =
    useState<EditProfileInfoFormData | null>(null);

  const token = useAuth();

  // Function to fetch original user data
  const fetchOriginalData = async (): Promise<void> => {
    setLoading(true);
    try {
      const BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${BASE_URL}/info/getAllUserInfo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user information. Please try again.');
      }
      const data: EditProfileInfoFormData = await response.json();
      setOriginalData(data);
      setFormData(data);
    } catch {
      setErrorMessage('Failed to fetch profile information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user information and set as placeholder values and as original data
  useEffect(() => {
    if (token?.userId !== null && token?.userId !== undefined) {
      fetchOriginalData();
    }
  }, [token]);

  // Check if form data has changed from original data
  const hasFormChanged = (): boolean => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  // Check field that has changed
  const hasFieldChanged = (field: keyof EditProfileInfoFormData): boolean => {
    if (!originalData) return false;
    return formData[field] !== originalData[field];
  };

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

  // Handle form submission to update user information
  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (!hasFormChanged()) {
      setErrorMessage('No changes made to the form. No information updated.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${BASE_URL}/info/updateUserInfo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user information');
      }

      const updatedData: EditProfileInfoFormData = await response.json();

      // Update both form data and original data with the response
      setFormData(updatedData);
      setOriginalData(updatedData);

      // Show success message
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to update profile information. Please try again.',
      );
      setTimeout(() => {
        setErrorMessage('');
      }, 6000);
    } finally {
      setLoading(false);
    }
  };

  // Handle reset form to original data
  const handleReset = (): void => {
    if (hasFormChanged()) {
      setFormData(originalData!);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='sm:w-2/3 text-xs md:text-base'>
      {loading ? (
        <p className='mx-auto'>Loading...</p>
      ) : errorMessage ? (
        <div className='flex justify-center gap-2 mt-5'>
          <IconComponent icon={MdErrorOutline} className='text-red-500' />
          <p className='text-red-500'>{errorMessage}</p>
          <IconComponent icon={MdErrorOutline} className='text-red-500' />
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          <div>
            <label
              htmlFor='firstNameInput'
              className='inline-block w-40 lg:w-60'
            >
              First name:{' '}
            </label>
            <InputField
              id='firstNameInput'
              type='text'
              placeholder={originalData?.firstName || 'First name'}
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              className={`w-2/3 bg-white ${hasFieldChanged('firstName') ? '!bg-amber-100' : ''}`}
            />
          </div>
          <div>
            <label
              htmlFor='lastNameInput'
              className='inline-block w-40 lg:w-60'
            >
              Last name:{' '}
            </label>
            <InputField
              id='lastNameInput'
              type='text'
              placeholder={originalData?.lastName || 'Last name'}
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              className={`w-2/3 bg-white ${hasFieldChanged('lastName') ? '!bg-amber-100' : ''}`}
            />
          </div>
          <div>
            <label htmlFor='addressInput' className='inline-block w-40 lg:w-60'>
              Address:{' '}
            </label>
            <InputField
              id='addressInput'
              type='text'
              placeholder={originalData?.address || 'Address'}
              value={formData.address}
              onChange={handleInputChange('address')}
              className={`w-2/3 bg-white ${hasFieldChanged('address') ? '!bg-amber-100' : ''}`}
            />
          </div>
          <div>
            <label htmlFor='emailInput' className='inline-block w-40 lg:w-60'>
              Email:{' '}
            </label>
            <InputField
              id='emailInput'
              type='text'
              placeholder={originalData?.email || 'Email'}
              value={formData.email}
              onChange={handleInputChange('email')}
              className={`w-2/3 bg-white ${hasFieldChanged('email') ? '!bg-amber-100' : ''}`}
            />
          </div>
          <div>
            <label
              htmlFor='phoneNumberInput'
              className='inline-block w-40 lg:w-60'
            >
              Phone number:
            </label>
            <InputField
              id='phoneNumberInput'
              type='text'
              placeholder={originalData?.phoneNumber || 'Phone number'}
              value={formData.phoneNumber}
              onChange={handleInputChange('phoneNumber')}
              className={`w-2/3 bg-white ${hasFieldChanged('phoneNumber') ? '!bg-amber-100' : ''}`}
            />
          </div>

          <div>
            <label
              htmlFor='preferredContactMethodSelection'
              className='inline-block w-40 md:w-60'
            >
              Preferred contact style:{' '}
            </label>
            <select
              id='preferredContactMethodSelection'
              value={formData.preferredContactMethod}
              onChange={handleSelectChange('preferredContactMethod')}
              className={`w-2/3 bg-white px-3 py-2 border border-gray-300 rounded-md dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 ${hasFieldChanged('preferredContactMethod') ? '!bg-amber-100' : ''}`}
            >
              <option value='NOTCHOSEN' className='text-center'>
                Not chosen
              </option>
              <option value='EMAIL' className='text-center'>
                Email
              </option>
              <option value='PHONECALL' className='text-center'>
                Phone call
              </option>
              <option value='TEXTMESSAGE' className='text-center'>
                Text message
              </option>
            </select>
          </div>
          {/* Reset and submit buttons */}
          <div className='flex gap-6 mt-4 mx-auto'>
            <Button
              icon={RiResetLeftLine}
              iconSize={18}
              ClassName='!bg-red-300 hover:!bg-red-400  dark:!bg-red-700 dark:hover:!bg-red-600'
              text='Reset form'
              onClick={handleReset}
              disabled={!hasFormChanged()}
            />
            <Button
              icon={FaRegSave}
              iconSize={18}
              type='submit'
              ClassName='relative'
              text='Save changes'
              disabled={!hasFormChanged()}
            />
            {successMessage && (
              <div className='absolute left-1/2 transform -translate-x-1/4 sm:translate-x-7 xl:translate-x-1/2 flex text-center justify-center items-center border border-green-900 bg-green-50 text-green-600 h-9 md:h-10 lg:h-11 font-semibold rounded-md px-2 lg:px-4'>
                {successMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
};

export default EditProfileInfoForm;
