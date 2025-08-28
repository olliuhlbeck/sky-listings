import { useState } from 'react';
import LoginForm from '../../components/LoginComponents/LoginForm';
import LoginPageTitle from '../../components/LoginComponents/LoginPageTitle';
import { ActionType } from '../../types/ActionType';
import { useLocation } from 'react-router-dom';

const LoginPage = () => {
  const location = useLocation();
  // Check initial action or default to login
  const initialAction =
    (location.state?.action as ActionType) || ActionType.Login;

  // Control page content with ActionType
  const [action, setAction] = useState<ActionType>(initialAction);

  return (
    <div className='relative bg-gray-50 dark:bg-blue-950 flex items-center rounded-lg w-5/6 md:w-4/6 min-w-[256px] h-[500px] shadow-md shadow-gray-700 mt-16 mx-auto gap-4 overflow-hidden'>
      <div className='w-full md:w-auto flex-1'>
        <LoginForm action={action} setAction={setAction} />
      </div>
      <LoginPageTitle action={action} setAction={setAction} />
    </div>
  );
};

export default LoginPage;
