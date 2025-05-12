import { MdOutlineEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaRegUser } from 'react-icons/fa';
import IconComponent from '../GeneralComponents/IconComponent';
import InputField from '../GeneralComponents/InputField';
import { useState } from 'react';
import { LoginComponentProps } from '../../types/LoginComponentProps';
import { ActionType } from '../../types/ActionType';
import { LoginInputs } from '../../types/LoginInputs';

const LoginForm = ({ action, setAction }: LoginComponentProps) => {
  const [inputs, setInputs] = useState<LoginInputs>({
    email: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, username: event.target.value });
    setErrors((prev) => ({ ...prev, username: '' }));
  };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, email: event.target.value });
    setErrors((prev) => ({ ...prev, email: '' }));
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, password: event.target.value });
    setErrors((prev) => ({ ...prev, password: '' }));
  };

  const validateEmail = (email: string) => {
    // Basic email validation regex copied from internet
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email) ? '' : 'Please enter a valid email.';
  };

  const validateUsername = (username: string) => {
    return username.trim().length > 0 ? '' : 'Username is required.';
  };

  const validatePassword = (password: string) => {
    return password.length >= 6 ? '' : 'Min. length 6 characters.';
  };

  const switchAction = () => {
    if (action === ActionType.Login) {
      setAction(ActionType.SignUp);
    } else {
      setAction(ActionType.Login);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailError =
      action === ActionType.SignUp ? validateEmail(inputs.email) : '';
    const usernameError = validateUsername(inputs.username);
    const passwordError = validatePassword(inputs.password);

    if (emailError || usernameError || passwordError) {
      setErrors({
        email: emailError,
        username: usernameError,
        password: passwordError,
      });
      return;
    }

    console.log('Form submitted successfully');
  };

  const isFormValid = !errors.username && !errors.email && !errors.password;

  return (
    <form
      name='loginForm'
      onSubmit={handleSubmit}
      className='flex flex-col grow items-center space-y-4'
    >
      <div className='md:hidden w-full flex items-center justify-center'>
        <h2 className='text-2xl lg:text-3xl font-bold'>
          {action === ActionType.Login ? 'Login' : 'Sign up'}
        </h2>
      </div>
      {action === ActionType.SignUp && (
        <div className='flex flex-col space-y-1'>
          <div className='flex space-x-2 items-center'>
            <IconComponent
              icon={MdOutlineEmail}
              className='self-center'
              aria-hidden='true'
            />
            <InputField
              name='emailInput'
              type='text'
              value={inputs.email}
              onChange={handleEmailChange}
              placeholder='Email'
              className='w-52'
            />
          </div>
          {errors.email && (
            <span className='text-red-500 text-sm'>{errors.email}</span>
          )}
        </div>
      )}

      <div className='flex flex-col space-y-1'>
        <div className='flex space-x-2 items-center'>
          <IconComponent
            icon={FaRegUser}
            className='self-center'
            aria-hidden='true'
          />
          <InputField
            name='usernameInput'
            type='text'
            value={inputs.username}
            onChange={handleUserNameChange}
            placeholder='Username'
            className='w-52'
          />
        </div>
        {errors.username && (
          <span className='text-red-500 text-sm'>{errors.username}</span>
        )}
      </div>

      <div className='flex flex-col space-y-1'>
        <div className='flex space-x-2 items-center'>
          <IconComponent
            icon={RiLockPasswordLine}
            className='self-center'
            aria-hidden='true'
          />
          <InputField
            name='passwordInput'
            type='password'
            value={inputs.password}
            onChange={handlePasswordChange}
            placeholder='Password'
            className='w-52'
          />
        </div>
        {errors.password && (
          <span className='text-red-500 text-sm'>{errors.password}</span>
        )}
      </div>

      <button
        className='hover:cursor-pointer border p-2 rounded-md hover:bg-sky-200'
        type='submit'
        disabled={!isFormValid}
      >
        {action === ActionType.Login ? 'Login' : 'Sign Up'}
      </button>

      <div>
        {action === ActionType.Login
          ? 'Do not have an account?'
          : 'Already have a account?'}
        <button
          type='button'
          className='hover:cursor-pointer hover:bg-sky-200 p-2 ml-2 rounded-md'
          onClick={switchAction}
        >
          {action === ActionType.Login
            ? 'Create one by clicking here'
            : 'Switch to login by clicking here'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
