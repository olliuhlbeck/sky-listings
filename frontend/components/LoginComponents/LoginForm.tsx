import { MdOutlineEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaRegUser } from 'react-icons/fa';
import IconComponent from '../GeneralComponents/IconComponent';
import InputField from '../GeneralComponents/InputField';
import { ChangeEvent, useState } from 'react';
import { LoginComponentProps } from '../../types/LoginComponentProps';
import { ActionType } from '../../types/ActionType';

const LoginForm = ({ action, setAction }: LoginComponentProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setUsername(input);
  };
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setPassword(input);
  };
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setEmail(input);
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
  };

  return (
    <form
      name='loginForm'
      onSubmit={handleSubmit}
      className='flex flex-col grow items-center space-y-4'
    >
      {action === ActionType.SignUp && (
        <div className='flex space-x-4'>
          <IconComponent icon={MdOutlineEmail} className='self-center' />
          <InputField
            name='emailInput'
            type='text'
            value={email}
            onChange={(event) => handleEmailChange(event)}
            placeholder='Email'
            className='w-24 md:w-52'
          />
        </div>
      )}

      <div className='flex space-x-4'>
        <IconComponent icon={FaRegUser} className='self-center' />
        <InputField
          name='usernameInput'
          type='text'
          value={username}
          onChange={(event) => handleUsernameChange(event)}
          placeholder='Username'
          className='w-24 md:w-52'
        />
      </div>
      <div className='flex space-x-4'>
        <IconComponent icon={RiLockPasswordLine} className='self-center' />
        <InputField
          name='passwordInput'
          type='password'
          value={password}
          onChange={(event) => handlePasswordChange(event)}
          placeholder='Password'
          className='w-24 md:w-52'
        />
      </div>
      <button className='hover:cursor-pointer border p-2 rounded-md hover:bg-sky-200'>
        Login
      </button>
      <span>
        {action === ActionType.Login
          ? 'Do not have an account?'
          : 'Already have a account?'}
        <button
          className='hover:cursor-pointer hover:bg-sky-200 p-2 rounded-full'
          onClick={switchAction}
        >
          {action === ActionType.Login
            ? 'Create one by clicking here'
            : 'Switch to login by clicking here'}
        </button>
      </span>
    </form>
  );
};

export default LoginForm;
