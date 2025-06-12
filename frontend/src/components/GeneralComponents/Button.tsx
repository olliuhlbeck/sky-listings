import { Link } from 'react-router-dom';
import { ButtonProps } from '../../types/ButtonProps';
import IconComponent from '../GeneralComponents/IconComponent';

const Button = ({
  type = 'button',
  children,
  ClassName,
  text,
  link,
  icon,
  iconSize,
  onClick,
}: ButtonProps) => {
  const basicClassName = `flex items-center gap-2 px-4 py-2 rounded-md text-md bg-sky-200 hover:cursor-pointer hover:bg-sky-300 transition duration-200 ${ClassName} `;

  if (link) {
    return (
      <Link to={link} className={basicClassName} onClick={onClick}>
        {icon && <IconComponent icon={icon} />}
        <span>{children ?? text}</span>
      </Link>
    );
  } else {
    return (
      <button type={type} className={basicClassName} onClick={onClick}>
        {icon && <IconComponent icon={icon} size={iconSize} />}
        <span>{children ?? text}</span>
      </button>
    );
  }
};

export default Button;
