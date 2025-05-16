import { Link } from 'react-router-dom';
import { HeaderContainerProps } from '../../types/HeaderContainerProps';
import HeaderButton from '../HeaderComponents/HeaderButton';
import IconComponent from '../GeneralComponents/IconComponent';
import { CiLogin, CiLogout } from 'react-icons/ci';
import { useAuth } from '../../utils/useAuth';
import { GiFamilyHouse } from 'react-icons/gi';

const HeaderContainer = ({ title, link }: HeaderContainerProps) => {
  const navigationLinks = [
    { text: 'Home', link: 'home' },
    { text: 'Pagination', link: 'pagination' },
  ];

  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className='fixed top-0 left-0 w-full z-'>
      <div className='container mx-auto flex items-center justify-between p-6'>
        <Link className='flex space-x-2 text-slate-900' to={link}>
          <IconComponent icon={GiFamilyHouse} size={32} />
          <h2 className='text-2xl text-center hidden md:block'>{title}</h2>
        </Link>
        <div className='absolute left-1/2 transform -translate-x-1/2 space-x-2 hidden xl:flex'>
          {navigationLinks.map(({ text, link }) => (
            <HeaderButton key={`${link}HeaderButton`} text={text} link={link} />
          ))}
        </div>
        <div className='flex items-center gap-2'>
          {!isAuthenticated ? (
            <HeaderButton icon={CiLogin} text='Login' link='login' />
          ) : (
            <>
              <p>
                logged in as: <strong>{user}</strong>
              </p>
              <HeaderButton
                icon={CiLogout}
                text='Logout'
                link='home'
                onClick={logout}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderContainer;
