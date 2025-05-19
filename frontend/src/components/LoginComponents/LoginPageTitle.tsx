import { ActionType } from '../../types/ActionType';
import { LoginComponentProps } from '../../types/LoginComponentProps';

const LoginPageTitle = ({ action }: LoginComponentProps) => {
  return (
    <div
      className={`bg-[url('./assets/loginBackground.jpg')] h-full w-1/3 bg-cover bg-center bg-no-repeat hidden md:flex items-center justify-center rounded-r-md`}
      style={{
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
