import { useAuth } from '../../utils/useAuth';

const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className='flex flex-col justify-center items-center mt-6'>
      {user ? (
        <h1 className='text-3xl'>{`Welcome ${user}!`}</h1>
      ) : (
        <>
          <h1 className='text-3xl mb-4'>Welcome!</h1>
          <p>Please login to unlock more features</p>
        </>
      )}
    </div>
  );
};

export default HomePage;
