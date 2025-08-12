import { BiDollar } from 'react-icons/bi';
import AdComponent from '../../components/GeneralComponents/AdComponent';
import { useAuth } from '../../utils/useAuth';
import { Link } from 'react-router-dom';
import { ActionType } from '../../types/ActionType';
import ContentButtonCard from '../../components/GeneralComponents/ContentButtonCard';
import browseHouses from '../../assets/browseHouses.jpg';
import sellHouse from '../../assets/sellHouse.jpg';
import Button from '../../components/GeneralComponents/Button';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className='flex flex-col justify-center items-center mt-20'>
      {/* Render different main content if there is logged in user or not */}
      {user ? (
        <>
          <div className='flex flex-col lg:flex-row w-4/6 gap-6'>
            <ContentButtonCard
              link='browseProperties'
              buttonText='Browse properties'
              backgroundImage={browseHouses}
              addToClassName='left-10 !bg-gray-100'
            />
            <ContentButtonCard
              link={'/addProperty'}
              buttonText='Sell properties'
              backgroundImage={sellHouse}
              addToClassName='right-10 !bg-blue-950 text-gray-50'
            />
          </div>
        </>
      ) : (
        <>
          <div className='flex flex-col lg:flex-row w-4/6 gap-6'>
            <ContentButtonCard
              link='browseProperties'
              buttonText='Browse properties'
              backgroundImage={browseHouses}
              addToClassName='left-10 !bg-gray-100'
            />
            <Link
              to={'login'}
              state={{ action: ActionType.SignUp }}
              className={`relative transition duration-300 hover:scale-[1.02] min-h-[12rem] lg:min-h-[24rem] shadow-lg shadow-slate-500 flex flex-1 justify-center items-center rounded-lg bg-[url('./assets/registerFront.png')] bg-cover bg-center `}
            >
              <Button ClassName='text-xl absolute -top-11 right-10 !rounded-b-none !bg-blue-600'>
                Register
              </Button>
            </Link>
          </div>
        </>
      )}
      {/* Render ad */}
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
