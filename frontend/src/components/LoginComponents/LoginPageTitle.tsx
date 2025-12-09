import { ActionType } from '../../types/ActionType';
import { LoginComponentProps } from '../../types/LoginComponentProps';

const LoginPageTitle = ({ action }: LoginComponentProps) => {
  return (
    <>
      {/* Title and background on top for smaller screens */}
      <div
        className="md:hidden absolute top-0 left-0 right-0 h-1/5 bg-[url('./assets/loginBackground.jpg')] dark:bg-[url('./assets/loginBgDarkMode.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center z-10"
        aria-hidden='true'
        style={{
          clipPath: 'polygon(0% 0, 100% 0, 100% 100%, 0 100%)',
        }}
      >
        <h1 className='text-3xl font-bold'>
          {action === ActionType.Login ? 'Login' : 'Sign up'}
        </h1>
      </div>

      {/* Title and background on right side for larger screens */}
      <div
        className="hidden md:flex bg-[url('./assets/loginBackground.jpg')] dark:bg-[url('./assets/loginBgDarkMode.png')] h-full w-1/3 bg-cover bg-center bg-no-repeat items-center justify-center rounded-r-md dark:text-white"
        style={{
          clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
        }}
      >
        <h1 className='md:text-3xl lg:text-4xl xl:text-5xl font-bold'>
          {action === ActionType.Login ? 'Login' : 'Sign up'}
        </h1>
      </div>
    </>
  );
};

export default LoginPageTitle;
