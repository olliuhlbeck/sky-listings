import { CgProfile } from 'react-icons/cg';
import IconComponent from '../../components/GeneralComponents/IconComponent';
import { useAuth } from '../../utils/useAuth';

const ProfilePage = () => {
  const token = useAuth();
  return (
    <div className='bg-white mt-10 pr-2 pl-2 flex flex-col min-w-64 w-6/10 rounded-md mx-auto'>
      <h2 className='font-semibold text-sm md:text-md lg:text-lg my-2'>
        Profile settings
      </h2>
      <div className='flex flex-col md:flex-row'>
        <div className='flex flex-1 items-center justify-center gap-4'>
          <IconComponent icon={CgProfile} size={24} />
          <h2>{token.user}</h2>
        </div>
        <div className='flex-1'>form</div>
      </div>
    </div>
  );
};

export default ProfilePage;
