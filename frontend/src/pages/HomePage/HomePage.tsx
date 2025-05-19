import { BiDollar } from 'react-icons/bi';
import AdComponent from '../../components/GeneralComponents/AdComponent';
import { useAuth } from '../../utils/useAuth';

const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className='flex flex-col justify-center items-center mt-6'>
      {user ? (
        <>
          <h1 className='text-3xl my-3'>{`Welcome ${user}!`}</h1>
          <div className='flex flex-col lg:flex-row w-4/6 gap-6'>
            <div
              className={`min-h-[12rem] lg:min-h-[24rem] shadow-lg shadow-slate-500 flex flex-1 justify-center items-center rounded-lg bg-[url('./assets/browseHouses.jpg')] bg-cover bg-center`}
            >
              <button className='text-2xl bg-sky-200 text-slate-900 rounded-full p-2 hover:bg-sky-400 hover:cursor-pointer'>
                Search houses
              </button>
            </div>
            <div
              className={`min-h-[12rem] lg:min-h-[24rem] shadow-lg shadow-slate-500 flex flex-1 justify-center items-center rounded-lg bg-[url('./assets/sellHouse.jpg')] bg-cover bg-center`}
            >
              <button className='text-2xl bg-sky-200 text-slate-900 rounded-full p-2 hover:bg-sky-400 hover:cursor-pointer'>
                List your house for sale
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className='text-3xl my-2'>Welcome!</h1>
          <div className='flex gap-4 w-5/6'>
            <div className='min-h-[20rem] flex flex-1 justify-center items-center '>
              <h2>Browse houses</h2>
            </div>
            <div className='min-h-[20rem] flex flex-1 justify-center items-center'>
              <h2>List your house for sale</h2>
            </div>
          </div>
        </>
      )}
      <AdComponent
        title='Mortgage Masters'
        message='Short on liquid assets? Mortgage Masters can solve your problems!'
        buttonText='Apply for loan'
        icon={BiDollar}
        addToClassName='mt-6'
      />
    </div>
  );
};

export default HomePage;
