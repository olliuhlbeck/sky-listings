import { useAuth } from '../../utils/useAuth';
import PFP from '../../assets/profile-picture-example.jpg';

const UserProfilePictureChanger = () => {
  const token = useAuth();
  return (
    <div className='flex flex-col sm:w-1/3 items-center justify-center gap-2 sm:gap-4'>
      <img
        src={PFP}
        alt='profilePictureDummy'
        className='rounded-full w-1/2 sm:w-4/5'
      />
      <h2>{token.user}</h2>
    </div>
  );
};

export default UserProfilePictureChanger;
