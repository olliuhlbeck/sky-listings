import { Link, useLocation } from 'react-router-dom';
import { HeaderContainerProps } from '../../types/HeaderContainerProps';
import HeaderButton from '../HeaderComponents/HeaderButton';
import IconComponent from '../GeneralComponents/IconComponent';
import { CiLogin, CiLogout } from 'react-icons/ci';
import { useAuth } from '../../utils/useAuth';
import { GiFamilyHouse } from 'react-icons/gi';
import { ActionType } from '../../types/ActionType';

const HeaderContainer = ({ title, link }: HeaderContainerProps) => {
  const navigationLinks = [
    { text: 'Home', link: 'home', authOnly: 'no' },
    { text: 'Pagination', link: 'pagination', authOnly: 'no' },
    { text: 'Browse Properties', link: 'browseProperties', authOnly: 'no' },
    { text: 'My Properties', link: 'myProperties', authOnly: 'yes' },
    { text: 'Add property', link: 'AddProperty', authOnly: 'yes' },
  ];

  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const isUserInLoginPage = location.pathname === '/login';

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-cover bg-top bg-[url('./assets/background.png')] shadow-sm`}
    >
      <div className='container mx-auto flex items-center justify-between p-3'>
        <Link className='flex space-x-2 text-slate-900' to={link}>
          <IconComponent icon={GiFamilyHouse} size={32} />
          <h2 className='text-2xl text-center hidden md:block'>{title}</h2>
        </Link>
        <div className='absolute left-1/2 transform -translate-x-1/2 space-x-2 hidden xl:flex'>
          {navigationLinks
            .filter((link) => link.authOnly === 'no' || user !== null)
            .map(({ text, link }) => (
              <HeaderButton
                key={`${link}HeaderButton`}
                text={text}
                link={link}
              />
            ))}
        </div>
        <div className='flex items-center gap-2'>
          {!isAuthenticated && !isUserInLoginPage ? (
            <HeaderButton
              additionsToClassName='bg-sky-200'
              icon={CiLogin}
              text='Login'
              link='login'
              state={{ action: ActionType.Login }}
            />
          ) : isAuthenticated ? (
            <>
              <p>
                logged in as: <strong>{user}</strong>
              </p>
              <HeaderButton
                additionsToClassName='bg-sky-200'
                icon={CiLogout}
                text='Logout'
                link='home'
                onClick={logout}
              />
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default HeaderContainer;
