import IconComponent from '../../components/GeneralComponents/IconComponent';
import { useAuth } from '../../utils/useAuth';
import { BiDollar } from 'react-icons/bi';

const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className='flex flex-col justify-center items-center mt-6'>
      {user ? (
        <>
          <h1 className='text-3xl my-2'>{`Welcome ${user}!`}</h1>
          <div className='flex gap-4 w-5/6'>
            <div className='min-h-[20rem] flex flex-1 justify-center items-center'>
              <h2>Browse houses</h2>
            </div>
            <div className='min-h-[20rem] flex flex-1 justify-center items-center'>
              <h2>List your house for sale</h2>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className='text-3xl my-2'>Welcome!</h1>
          <div className='flex gap-4 w-5/6'>
            <div className='min-h-[20rem] flex flex-1 justify-center items-center'>
              <h2>Browse houses</h2>
            </div>
            <div className='min-h-[20rem] flex flex-1 justify-center items-center'>
              <h2>List your house for sale</h2>
            </div>
          </div>
        </>
      )}
      <div className='flex w-4/6 items-center p-4 rounded-md shadow-lg shadow-slate-500 bg-sky-800 gap-10'>
        <div className='pl-6 hidden md:block'>
          <IconComponent icon={BiDollar} size={36} className='text-sky-200' />
        </div>
        <div className='w-full'>
          <h1 className='text-gray-50 font-bold text-2xl'>Mortage Masters</h1>
          <p className='text-gray-50 my-4'>
            Short on liquid assets? Mortage Masters can solve your problems!
          </p>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault();
              console.log('Dummy advertisement.');
            }}
            className='inline-block border-none p-2 rounded-full w-content md:w-3xs bg-sky-200 hover:bg-sky-300 hover:cursor-pointer text-center'
          >
            Apply for loan
          </a>
        </div>
        <div className='pr-6 hidden md:block'>
          <IconComponent icon={BiDollar} size={36} className='text-sky-200' />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
