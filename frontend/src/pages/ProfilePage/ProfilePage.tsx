import EditProfileInfoForm from '../../components/ProfileComponents/EditProfileInfoForm';
import UserProfilePictureChanger from '../../components/ProfileComponents/UserProfilePictureChanger';

const ProfilePage = () => {
  return (
    <div className='bg-white dark:bg-slate-700 flex flex-col mt-10 pb-5 min-w-60 w-4/5 rounded-md mx-auto shadow-md dark:shadow-gray-600'>
      <h2 className='font-semibold w-9/10 text-sm md:text-md lg:text-lg py-4 mb-4 border-b mx-auto'>
        Profile settings
      </h2>
      <div className='flex flex-col sm:flex-row w-9/10 mx-auto gap-4 '>
        <UserProfilePictureChanger />
        <EditProfileInfoForm />
      </div>
    </div>
  );
};

export default ProfilePage;
