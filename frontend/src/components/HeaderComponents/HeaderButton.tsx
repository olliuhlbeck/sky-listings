import { MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { HeaderButtonProps } from '../../types/HeaderButtonProps';
import IconComponent from '../GeneralComponents/IconComponent';

const HeaderButton = ({ text, link, icon, onClick }: HeaderButtonProps) => {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Link
      to={link}
      className='flex items-center gap-2 px-4 py-2 rounded-md text-lg bg-sky-200 hover:bg-blue-300'
      onClick={handleClick}
    >
      {icon && <IconComponent icon={icon} />}
      <span>{text}</span>
    </Link>
  );
};

export default HeaderButton;
