import { useAuth } from '../../utils/useAuth';

const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className='flex flex-col justify-center items-center mt-6'>
      {user ? (
        <>
          <h1 className='text-3xl my-2'>{`Welcome ${user}!`}</h1>
          <div className='flex gap-4 w-5/6'>
            <div className='flex flex-1 justify-center items-center'>
              <h2>Browse houses</h2>
            </div>
            <div className='flex flex-1 justify-center items-center'>
              <h2>List your house for sale</h2>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className='text-3xl my-2'>Welcome!</h1>
          <div className='flex gap-4 w-5/6'>
            <div className='flex flex-1 justify-center items-center'>
              <h2>Browse houses</h2>
            </div>
            <div className='flex flex-1 justify-center items-center'>
              <h2>List your house for sale</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
