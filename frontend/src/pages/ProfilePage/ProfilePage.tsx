import { CgProfile } from 'react-icons/cg';
import IconComponent from '../../components/GeneralComponents/IconComponent';
import { useAuth } from '../../utils/useAuth';
import EditProfileInfoForm from '../../components/ProfileComponents/EditProfileInfoForm';

const ProfilePage = () => {
  const token = useAuth();
  return (
    <div className='bg-white dark:bg-slate-700 flex flex-col mt-10 pb-5 min-w-60 w-4/5 rounded-md mx-auto shadow-md'>
      <h2 className='font-semibold w-9/10 text-sm md:text-md lg:text-lg py-4 mb-4 border-b mx-auto'>
        Profile settings
      </h2>
      <div className='flex flex-col md:flex-row w-9/10 mx-auto gap-4 '>
        <div className='flex flex-col md:w-1/3 items-center justify-center gap-1 md:gap-4 bg-green-300'>
          <IconComponent icon={CgProfile} size={24} />
          <h2>{token.user}</h2>
        </div>
        <EditProfileInfoForm />
      </div>
    </div>
  );
};

export default ProfilePage;
