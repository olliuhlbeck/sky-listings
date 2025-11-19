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
  disabled,
  testId,
}: ButtonProps) => {
  const hasText = Boolean(children ?? text);
  const basicClassName = `flex items-center ${hasText ? ' gap-2 px-4 py-2 ' : 'p-2'} rounded-md text-xs md:text-base lg:text-lg bg-sky-200 dark:bg-blue-800 hover:cursor-pointer hover:bg-sky-300 dark:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition duration-200 ${ClassName}`;

  if (link) {
    return (
      // If link given render just a navigating link
      <Link to={link} className={basicClassName} onClick={onClick}>
        {icon && <IconComponent icon={icon} />}
        <span>{children ?? text}</span>
      </Link>
    );
  } else {
    return (
      // If no link render native button with on click behavior
      <button
        type={type}
        className={basicClassName}
        onClick={onClick}
        disabled={disabled}
        data-testid={testId}
      >
        {icon && <IconComponent icon={icon} size={iconSize} />}
        <span>{children ?? text}</span>
      </button>
    );
  }
};

export default Button;
