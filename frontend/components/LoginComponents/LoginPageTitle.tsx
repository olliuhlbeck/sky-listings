import loginBackground from '../../src/assets/loginBackground.jpg';
import { ActionType } from '../../types/ActionType';
import { LoginComponentProps } from '../../types/LoginComponentProps';

const LoginPageTitle = ({ action }: LoginComponentProps) => {
  return (
    <div
      className='h-full w-1/3 bg-cover bg-center bg-no-repeat hidden md:flex items-center justify-center rounded-r-md'
      style={{
        backgroundImage: `url(${loginBackground})`,
        clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
      }}
    >
      <h2 className='text-2xl lg:text-5xl font-bold'>
        {action === ActionType.Login ? 'Login' : 'Sign up'}
      </h2>
    </div>
  );
};
export default LoginPageTitle;
