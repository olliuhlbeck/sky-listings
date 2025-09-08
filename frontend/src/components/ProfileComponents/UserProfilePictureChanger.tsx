import { CgProfile } from 'react-icons/cg';
import { useAuth } from '../../utils/useAuth';
import IconComponent from '../GeneralComponents/IconComponent';

const UserProfilePictureChanger = () => {
  const token = useAuth();
  return (
    <div className='flex flex-col sm:w-1/3 items-center justify-center gap-1 sm:gap-4 bg-green-300'>
      <IconComponent icon={CgProfile} size={24} />
      <h2>{token.user}</h2>
    </div>
  );
};

export default UserProfilePictureChanger;
