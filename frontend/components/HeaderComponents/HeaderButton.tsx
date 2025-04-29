import { MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { HeaderButtonProps } from '../../types/HeaderButtonProps';

const HeaderButton = ({ text, link, onClick }: HeaderButtonProps) => {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Link
      to={link}
      className='px-4 py-2 rounded-md text-lg bg-sky-200 hover:bg-blue-300'
      onClick={handleClick}
    >
      {text}
    </Link>
  );
};

export default HeaderButton;
