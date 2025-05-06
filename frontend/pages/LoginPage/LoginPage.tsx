import { useState } from 'react';
import LoginForm from '../../components/LoginComponents/LoginForm';
import LoginPageTitle from '../../components/LoginComponents/LoginPageTitle';
import { ActionType } from '../../types/ActionType';

const LoginPage = () => {
  const [action, setAction] = useState<ActionType>(ActionType.Login);

  return (
    <div className='flex items-center rounded-lg bg-gray-50 w-4/6 h-[500px] shadow-md shadow-gray-500 mt-16 mx-auto gap-4'>
      <LoginForm action={action} setAction={setAction} />
      <LoginPageTitle action={action} setAction={setAction} />
    </div>
  );
};

export default LoginPage;
