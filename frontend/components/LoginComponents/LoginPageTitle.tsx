import loginBackground from '../../src/assets/loginBackground.jpg';

const LoginPageTitle = () => {
  return (
    <div
      className='h-full w-1/3 bg-cover bg-center bg-no-repeat hidden md:flex items-center justify-center rounded-r-md'
      style={{
        backgroundImage: `url(${loginBackground})`,
        clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
      }}
    >
      <h2 className='text-3xl text-blue-900'>Login</h2>
    </div>
  );
};
export default LoginPageTitle;
