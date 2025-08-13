import { Link, useLocation } from 'react-router-dom';
import { HeaderContainerProps } from '../../types/HeaderContainerProps';
import HeaderButton from '../HeaderComponents/HeaderButton';
import IconComponent from '../GeneralComponents/IconComponent';
import { CiLogin, CiLogout } from 'react-icons/ci';
import { useAuth } from '../../utils/useAuth';
import { GiFamilyHouse } from 'react-icons/gi';
import { ActionType } from '../../types/ActionType';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoClose } from 'react-icons/io5';
import { useEffect, useRef } from 'react';
import { CgProfile } from 'react-icons/cg';

const HeaderContainer = ({
  title,
  link,
  isHamburgerMenuOpen,
  setIsHamburgerMenuOpen,
}: HeaderContainerProps) => {
  const navigationLinks = [
    { text: 'Home', link: 'home', authOnly: 'no' },
    { text: 'Browse Properties', link: 'browseProperties', authOnly: 'no' },
    { text: 'My Properties', link: 'myProperties', authOnly: 'yes' },
    { text: 'Add property', link: 'AddProperty', authOnly: 'yes' },
  ];

  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const isUserInLoginPage = location.pathname === '/login';

  // Hamburger menu pop up control refs
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isHamburgerMenuOpen &&
        hamburgerRef.current &&
        popupRef.current &&
        !hamburgerRef.current.contains(event.target as Node) &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsHamburgerMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHamburgerMenuOpen, setIsHamburgerMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-cover bg-top bg-[url('./assets/background.png')] shadow-sm z-30`}
    >
      <div className='container mx-auto flex items-center justify-between p-3'>
        <Link className='flex space-x-2 text-slate-900' to={link}>
          <IconComponent icon={GiFamilyHouse} size={32} />
          <h2 className='text-2xl text-center hidden md:block'>{title}</h2>
        </Link>
        <div
          ref={hamburgerRef}
          className='xl:hidden'
          onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)}
        >
          {isHamburgerMenuOpen ? (
            <IconComponent
              icon={IoClose}
              size={30}
              className='hover:bg-sky-300 transition duration-200 p-1 rounded-md hover:cursor-pointer'
            />
          ) : (
            <IconComponent
              icon={RxHamburgerMenu}
              size={30}
              className='hover:bg-sky-300 transition duration-200 p-1 rounded-md hover:cursor-pointer'
            />
          )}
        </div>
        {isHamburgerMenuOpen && (
          <div
            ref={popupRef}
            className='absolute z-50 top-20 right-1/2 md:left-1/2 transform translate-x-1/3 md:-translate-x-1/3 w-64 bg-white shadow-lg rounded-md p-2 xl:hidden'
          >
            {navigationLinks
              .filter((link) => link.authOnly === 'no' || user !== null)
              .map(({ text, link }) => (
                <HeaderButton
                  additionsToClassName='mt-3'
                  key={`${link}MobileMenuButton`}
                  text={text}
                  link={link}
                  onClick={() => setIsHamburgerMenuOpen(false)}
                />
              ))}
          </div>
        )}
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
              <div className='flex gap-2 mr-2'>
                <strong>{user}</strong>
                <IconComponent icon={CgProfile} />
              </div>
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
