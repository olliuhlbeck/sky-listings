import { BiDollar } from 'react-icons/bi';
import AdComponent from '../../components/GeneralComponents/AdComponent';
import { useAuth } from '../../utils/useAuth';
import { useNavigate } from 'react-router-dom';
import { ActionType } from '../../types/ActionType';
import ContentButtonCard from '../../components/GeneralComponents/ContentButtonCard';
import browseHouses from '../../assets/browseHouses.jpg';
import sellHouse from '../../assets/browseHouses.jpg';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className='flex flex-col justify-center items-center mt-6'>
      {user ? (
        <>
          <h1 className='text-3xl my-3'>{`Hi ${user}!`}</h1>
          <div className='flex flex-col lg:flex-row w-4/6 gap-6'>
            <ContentButtonCard
              buttonText='Browse properties'
              backgroundImage={browseHouses}
            />
            <ContentButtonCard
              buttonText='List your property for sale!'
              backgroundImage={sellHouse}
            />
          </div>
        </>
      ) : (
        <>
          <h1 className='text-3xl my-2'>Welcome to Sky Listings!</h1>
          <div className='flex flex-col lg:flex-row w-4/6 gap-6'>
            <ContentButtonCard
              buttonText='Browse properties'
              backgroundImage={browseHouses}
            />
            <div
              className={`min-h-[12rem] lg:min-h-[24rem] shadow-lg shadow-slate-500 flex flex-1 justify-center items-center rounded-lg bg-[url('./assets/registerFront.png')] bg-cover bg-center`}
            >
              <button
                className='w-[16rem] md:w-[20rem] text-2xl bg-sky-200 text-slate-900 rounded-md p-2 hover:bg-sky-400 hover:cursor-pointer'
                onClick={() =>
                  navigate('login', { state: { action: ActionType.SignUp } })
                }
              >
                Register to list your property!
              </button>
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
