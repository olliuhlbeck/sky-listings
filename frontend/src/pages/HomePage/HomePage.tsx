import { BiDollar } from 'react-icons/bi';
import AdComponent from '../../components/GeneralComponents/AdComponent';
import { useAuth } from '../../utils/useAuth';
import { useNavigate } from 'react-router-dom';
import { ActionType } from '../../types/ActionType';
import ContentButtonCard from '../../components/GeneralComponents/ContentButtonCard';
import browseHouses from '../../assets/browseHouses.jpg';
import sellHouse from '../../assets/sellHouse.jpg';
import Button from '../../components/GeneralComponents/Button';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className='flex flex-col justify-center items-center mt-6'>
      {user ? (
        <>
          <div className='flex flex-col lg:flex-row w-4/6 gap-6'>
            <ContentButtonCard
              onClick={() => navigate('browseProperties')}
              buttonText='Browse properties'
              backgroundImage={browseHouses}
            />
            <ContentButtonCard
              onClick={() => navigate('myProperties')}
              buttonText='List your property for sale!'
              backgroundImage={sellHouse}
            />
          </div>
        </>
      ) : (
        <>
          <div className='flex flex-col lg:flex-row w-4/6 gap-6'>
            <ContentButtonCard
              onClick={() => navigate('browseProperties')}
              buttonText='Browse properties'
              backgroundImage={browseHouses}
            />
            <div
              className={`min-h-[12rem] lg:min-h-[24rem] shadow-lg shadow-slate-500 flex flex-1 justify-center items-center rounded-lg bg-[url('./assets/registerFront.png')] bg-cover bg-center`}
            >
              <Button
                ClassName='w-[16rem] md:w-[20rem] text-2xl'
                onClick={() =>
                  navigate('login', { state: { action: ActionType.SignUp } })
                }
              >
                Register to list your property!
              </Button>
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
