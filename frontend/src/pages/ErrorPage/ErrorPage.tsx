import { RiErrorWarningLine } from 'react-icons/ri';
import IconComponent from '../../components/GeneralComponents/IconComponent';
import { ErrorPageProps } from '../../types/ErrorPageProps';
import HeaderButton from '../../components/HeaderComponents/HeaderButton';

const ErrorPage = ({ errorCode }: ErrorPageProps) => {
  const isNotFoundError = errorCode === 404;

  return (
    <main
      role='alert'
      aria-live='assertive'
      aria-labelledby='error-title'
      aria-describedby='error-description'
      className='flex flex-col h-screen w-full items-center'
    >
      <div className='bg-white flex items-center justify-center gap-10 w-5/6 md:w-3/6 h-[20rem] border-2 rounded-2xl my-10 px-3'>
        <IconComponent
          icon={RiErrorWarningLine}
          size={30}
          className='text-red-500'
          aria-hidden='true'
        />
        <div className='flex flex-col justify-center items-center gap-4'>
          <h2
            id='error-title'
            className='text-xl md:text-3xl font-bold text-gray-800'
          >
            {isNotFoundError ? 'Page Not Found' : 'Something Went Wrong'}
          </h2>
          <div
            id='error-description'
            role='alert'
            aria-live='polite'
            className='text-gray-600'
          >
            {errorCode === 404 ? (
              <>
                <p>Error {errorCode}: Page not found.</p>
                <p>Please check provided URL.</p>
              </>
            ) : (
              <p>
                We encountered an unexpected error
                {errorCode ? ` (${errorCode})` : ''}.
              </p>
            )}
          </div>
          <HeaderButton
            link='/'
            text={'Go back to home page'}
            additionsToClassName='bg-sky-200'
            aria-label='Go back to home page'
          />
        </div>
        <IconComponent
          icon={RiErrorWarningLine}
          size={30}
          className='text-red-500'
          aria-hidden='true'
        />
      </div>
    </main>
  );
};

export default ErrorPage;
