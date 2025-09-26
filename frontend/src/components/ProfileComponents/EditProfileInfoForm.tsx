import { useEffect, useState } from 'react';
import { EditProfileInfoFormData } from '../../types/EditProfileInfoFormData';
import InputField from '../GeneralComponents/InputField';
import { useAuth } from '../../utils/useAuth';
import IconComponent from '../GeneralComponents/IconComponent';
import { MdErrorOutline } from 'react-icons/md';
const EditProfileInfoForm = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
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

  // Fetch current user information and set as placeholder values and original data
  useEffect(() => {
    if (token?.userId !== null && token?.userId !== undefined) {
      fetchOriginalData();
    }
  }, [token]);

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
            <label className='inline-block w-40 lg:w-60'>First name: </label>
            <InputField
              type='text'
              placeholder={originalData?.firstName || 'First name'}
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              className='w-2/3 bg-white'
            />
          </div>
          <div>
            <label className='inline-block w-40 lg:w-60'>Last name: </label>
            <InputField
              type='text'
              placeholder={originalData?.lastName || 'Last name'}
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              className='w-2/3 bg-white'
            />
          </div>
          <div>
            <label className='inline-block w-40 lg:w-60'>Address: </label>
            <InputField
              type='text'
              placeholder={originalData?.address || 'Address'}
              value={formData.address}
              onChange={handleInputChange('address')}
              className='w-2/3 bg-white'
            />
          </div>
          <div>
            <label className='inline-block w-40 lg:w-60'>Email: </label>
            <InputField
              type='text'
              placeholder={originalData?.email || 'Email'}
              value={formData.email}
              onChange={handleInputChange('email')}
              className='w-2/3 bg-white'
            />
          </div>
          <div>
            <label className='inline-block w-40 lg:w-60'>Phone number:</label>
            <InputField
              type='text'
              placeholder={originalData?.phoneNumber || 'Phone number'}
              value={formData.phoneNumber}
              onChange={handleInputChange('phoneNumber')}
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
        </div>
      )}
    </div>
  );
};

export default EditProfileInfoForm;
