import { RiErrorWarningLine } from 'react-icons/ri';
import IconComponent from '../../components/GeneralComponents/IconComponent';
import { ErrorPageProps } from '../../types/ErrorPageProps';
import HeaderButton from '../../components/HeaderComponents/HeaderButton';

const ErrorPage = ({ errorCode }: ErrorPageProps) => {
  return (
    <div
      className={`flex flex-col h-screen w-full items-center bg-cover bg-center bg-[url('./assets/background.png')]`}
    >
      <div className='bg-white flex items-center justify-center gap-10 w-5/6 md:w-3/6 h-[20rem] border-2 rounded-2xl my-10 px-3'>
        <IconComponent
          icon={RiErrorWarningLine}
          size={30}
          className='text-red-500'
        />
        <div className='flex flex-col justify-center items-center gap-4'>
          <h2>We have encountered an error.</h2>
          {errorCode === 404 ? (
            <>
              <p>Error code {errorCode}. Page not found.</p>
              <p>Please check provided URL.</p>
            </>
          ) : (
            <p>We have encountered an error.</p>
          )}
          <HeaderButton
            link='/'
            text={'Go back to home page'}
            additionsToClassName='bg-sky-200'
          />
        </div>
        <IconComponent
          icon={RiErrorWarningLine}
          size={30}
          className='text-red-500'
        />
      </div>
    </div>
  );
};

export default ErrorPage;
