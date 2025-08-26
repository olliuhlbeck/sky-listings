import IconComponent from './IconComponent';

import { AdTypes } from '../../types/AdTypes';
import ToolTip from './ToolTip';

const AdComponent: React.FC<AdTypes> = ({
  icon,
  title,
  message,
  buttonText,
  onClick,
  addToClassName,
}) => {
  const handleClick = onClick
    ? onClick
    : (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        console.log('Dummy advertisement.');
      };

  return (
    <div
      data-testid='ad-component'
      className={`flex w-4/6 items-center p-4 rounded-lg shadow-md shadow-slate-500 dark:shadow-gray-700 bg-gradient-to-r from-blue-600 dark:from-blue-900 to-blue-950 dark:to-blue-950 gap-10 ${addToClassName}`}
    >
      <div className='pl-6 hidden md:block'>
        <IconComponent icon={icon} size={36} className='text-sky-200' />
      </div>
      <div className='w-full'>
        <h2 className='text-gray-50 font-bold text-lg md:text-2xl'>{title}</h2>
        <p className='text-gray-50 my-4 text-xs md:text-lg'>{message}</p>
        <ToolTip toolTipText='This ad button will not take you anywhere'>
          <a
            href='#'
            onClick={handleClick}
            className='inline-block border-none p-2 rounded-md w-content md:w-3xs bg-sky-200 dark:bg-blue-950 hover:bg-sky-300 dark:hover:bg-blue-600 hover:cursor-pointer text-center transition duration-200'
          >
            {buttonText}
          </a>
        </ToolTip>
      </div>
      <div className='pr-6 hidden md:block'>
        <IconComponent icon={icon} size={36} className='text-sky-200' />
      </div>
    </div>
  );
};

export default AdComponent;
