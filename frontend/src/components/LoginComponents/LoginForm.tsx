import { MdOutlineEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaRegUser } from 'react-icons/fa';
import IconComponent from '../GeneralComponents/IconComponent';
import InputField from '../GeneralComponents/InputField';
import { useState } from 'react';
import { LoginComponentProps } from '../../types/LoginComponentProps';
import { ActionType } from '../../types/ActionType';
import { LoginInputs } from '../../types/LoginInputs';
import { useAuth } from '../../utils/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from '../GeneralComponents/Button';
import ToolTip from '../GeneralComponents/ToolTip';
import { TbCircleLetterF, TbCircleLetterL } from 'react-icons/tb';

const LoginForm = ({ action, setAction }: LoginComponentProps) => {
  const [inputs, setInputs] = useState<LoginInputs>({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    generalError?: string;
  }>({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const resetForm = () => {
    setInputs({
      email: '',
      username: '',
      password: '',
      firstName: '',
      lastName: '',
    });
    setErrors({});
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, username: event.target.value });
    setErrors((prev) => ({ ...prev, username: '', generalError: '' }));
  };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, email: event.target.value });
    setErrors((prev) => ({ ...prev, email: '', generalError: '' }));
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, password: event.target.value });
    setErrors((prev) => ({ ...prev, password: '', generalError: '' }));
  };
  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputs({ ...inputs, firstName: event.target.value });
    setErrors((prev) => ({ ...prev, firstName: '', generalError: '' }));
  };
  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, lastName: event.target.value });
    setErrors((prev) => ({ ...prev, lastName: '', generalError: '' }));
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
  const validateFirstName = (firstName: string) => {
    return firstName.trim().length > 0 ? '' : 'First name is required.';
  };
  const validateLastName = (lastName: string) => {
    return lastName.trim().length > 0 ? '' : 'Last name is required.';
  };

  const switchAction = () => {
    if (action === ActionType.Login) {
      setAction(ActionType.SignUp);
    } else {
      setAction(ActionType.Login);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailError =
      action === ActionType.SignUp ? validateEmail(inputs.email) : '';
    const firstNameError =
      action === ActionType.SignUp ? validateFirstName(inputs.firstName) : '';
    const lastNameError =
      action === ActionType.SignUp ? validateLastName(inputs.lastName) : '';
    const usernameError = validateUsername(inputs.username);
    const passwordError = validatePassword(inputs.password);

    if (
      emailError ||
      firstNameError ||
      lastNameError ||
      usernameError ||
      passwordError
    ) {
      setErrors({
        email: emailError,
        firstName: firstNameError,
        lastName: lastNameError,
        username: usernameError,
        password: passwordError,
      });
      return;
    }

    try {
      const BASE_URL = import.meta.env.VITE_API_URL;
      if (action === ActionType.Login) {
        const response = await fetch(`${BASE_URL}/login/`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            username: inputs.username,
            password: inputs.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          login(data.token);
        } else {
          const message =
            data.error ||
            data.message ||
            'Something went wrong. Please try again.';
          setErrors((prev) => ({ ...prev, generalError: message }));
          return;
        }
      } else if (action === ActionType.SignUp) {
        const response = await fetch('http://localhost:3000/signup', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email: inputs.email,
            firstName: inputs.firstName,
            lastName: inputs.lastName,
            username: inputs.username,
            password: inputs.password,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          login(data.token);
        } else {
          const data = await response.json();
          const message =
            data.error ||
            data.message ||
            'Something went wrong. Please try again.';
          setErrors((prev) => ({ ...prev, generalError: message }));
          return;
        }
      }
      resetForm();
      navigate('/');
    } catch {
      setErrors((prev) => ({
        ...prev,
        generalError:
          'Network error. Please check your connection and try again.',
      }));
    }
  };

  const isFormValid =
    inputs.username.trim().length > 0 &&
    inputs.password.length >= 6 &&
    (action === ActionType.Login ||
      (inputs.firstName.trim().length > 0 &&
        inputs.lastName.trim().length > 0 &&
        inputs.email.trim().length > 0)) &&
    !errors.username &&
    !errors.email &&
    !errors.password &&
    !errors.firstName &&
    !errors.lastName;

  return (
    <form
      name='loginForm'
      onSubmit={handleSubmit}
      className='flex flex-col grow items-center space-y-4'
    >
      <div className='md:hidden w-full flex items-center justify-center mb-16'></div>
      {action === ActionType.SignUp && (
        <>
          {/* First Name Field */}
          <div className='flex flex-col space-y-1'>
            <div className='flex space-x-2 items-center'>
              <IconComponent
                icon={TbCircleLetterF}
                className='self-center'
                aria-hidden='true'
              />
              <InputField
                name='firstNameInput'
                type='text'
                value={inputs.firstName}
                onChange={handleFirstNameChange}
                placeholder='First Name'
                className='w-52 dark:bg-gray'
              />
            </div>
            {errors.firstName && (
              <span className='text-red-500 text-xs md:text-base'>
                {errors.firstName}
              </span>
            )}
          </div>

          {/* Last Name Field */}
          <div className='flex flex-col space-y-1'>
            <div className='flex space-x-2 items-center'>
              <IconComponent
                icon={TbCircleLetterL}
                className='self-center'
                aria-hidden='true'
              />
              <InputField
                name='lastNameInput'
                type='text'
                value={inputs.lastName}
                onChange={handleLastNameChange}
                placeholder='Last Name'
                className='w-52 dark:bg-gray'
              />
            </div>
            {errors.lastName && (
              <span className='text-red-500 text-xs md:text-base'>
                {errors.lastName}
              </span>
            )}
          </div>

          {/* Email Field */}
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
                className='w-52 dark:bg-gray'
              />
            </div>
            {errors.email && (
              <span className='text-red-500 text-xs md:text-base'>
                {errors.email}
              </span>
            )}
          </div>
        </>
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
            className='w-52 dark:bg-gray'
          />
        </div>
        {errors.username && (
          <span className='text-red-500 text-xs md:text-base'>
            {errors.username}
          </span>
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
            className='w-52 dark:bg-gray'
          />
        </div>
        {errors.password && (
          <span className='text-red-500 text-xs md:text-base'>
            {errors.password}
          </span>
        )}
      </div>

      {!isFormValid ? (
        <ToolTip
          toolTipText='Please fill out all fields before submitting.'
          addToClassName='border'
        >
          <Button
            ClassName='border bg-transparent'
            type='submit'
            disabled={!isFormValid}
          >
            {action === ActionType.Login ? 'Login' : 'Sign Up'}
          </Button>
        </ToolTip>
      ) : (
        <Button
          ClassName='border bg-transparent'
          type='submit'
          disabled={!isFormValid}
        >
          {action === ActionType.Login ? 'Login' : 'Sign Up'}
        </Button>
      )}

      {errors.generalError && (
        <span className='text-red-500 text-xs md:text-base w-52'>
          {errors.generalError}
        </span>
      )}

      <div className='text-xs md:text-base lg:text-lg pb-1 md:pb-8'>
        {action === ActionType.Login
          ? 'Do not have an account?'
          : 'Already have a account?'}
        <Button
          type='button'
          ClassName='bg-transparent dark:bg-transparent'
          onClick={switchAction}
        >
          {action === ActionType.Login
            ? 'Create one by clicking here'
            : 'Switch to login by clicking here'}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
