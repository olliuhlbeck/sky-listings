import { useState } from 'react';
import LoginForm from '../../components/LoginComponents/LoginForm';
import LoginPageTitle from '../../components/LoginComponents/LoginPageTitle';
import { ActionType } from '../../types/ActionType';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Check initial action or default to login
  const initialAction =
    (location.state?.action as ActionType) || ActionType.Login;

  // Control page content with ActionType
  const [action, setAction] = useState<ActionType>(initialAction);

  // While authentication state is being checked, show a loader
  if (loading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
        <p role='status' aria-label='loading' className='ml-3 text-gray-600'>
          Checking authentication state...
        </p>
      </div>
    );
  }

  // Redirect user to home page if already authenticated
  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <main className='relative bg-gray-50 dark:bg-blue-950 flex items-center rounded-lg w-5/6 md:w-4/6 min-w-[256px] md:h-[620px] shadow-md shadow-gray-700 mt-10 mx-auto gap-4 overflow-hidden'>
      <div className='w-full md:w-auto flex-1 pt-16 pb-2 md:pb-4'>
        <LoginForm action={action} setAction={setAction} />
      </div>
      <LoginPageTitle action={action} setAction={setAction} />
    </main>
  );
};

export default LoginPage;
