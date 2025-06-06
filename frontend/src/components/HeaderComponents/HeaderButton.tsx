import { MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { HeaderButtonProps } from '../../types/HeaderButtonProps';
import IconComponent from '../GeneralComponents/IconComponent';

const HeaderButton = ({
  additionsToClassName,
  text,
  link,
  icon,
  onClick,
  state,
}: HeaderButtonProps) => {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Link
      to={link}
      state={state}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-lg hover:bg-sky-300 transition duration-200 ${additionsToClassName}`}
      onClick={handleClick}
    >
      {icon && <IconComponent icon={icon} />}
      <span>{text}</span>
    </Link>
  );
};

export default HeaderButton;
