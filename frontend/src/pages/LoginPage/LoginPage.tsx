import { useState } from 'react';
import LoginForm from '../../components/LoginComponents/LoginForm';
import LoginPageTitle from '../../components/LoginComponents/LoginPageTitle';
import { ActionType } from '../../types/ActionType';
import { useLocation } from 'react-router-dom';

const LoginPage = () => {
  const location = useLocation();
  const initialAction =
    (location.state?.action as ActionType) || ActionType.Login;

  const [action, setAction] = useState<ActionType>(initialAction);

  return (
    <div className='flex items-center rounded-lg bg-gray-50 w-5/6 md:w-4/6 min-w-[256px] h-[500px] shadow-md shadow-gray-500 mt-16 mx-auto gap-4'>
      <LoginForm action={action} setAction={setAction} />
      <LoginPageTitle action={action} setAction={setAction} />
    </div>
  );
};

export default LoginPage;
