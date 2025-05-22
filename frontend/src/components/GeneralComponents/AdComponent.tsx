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
      className={`flex w-4/6 items-center p-4 rounded-lg shadow-lg shadow-slate-500 bg-sky-800 gap-10 ${addToClassName}`}
    >
      <div className='pl-6 hidden md:block'>
        <IconComponent icon={icon} size={36} className='text-sky-200' />
      </div>
      <div className='w-full'>
        <h2 className='text-gray-50 font-bold text-2xl'>{title}</h2>
        <p className='text-gray-50 my-4'>{message}</p>
        <ToolTip toolTipText='This ad button will not take you anywhere'>
          <a
            href='#'
            onClick={handleClick}
            className='inline-block border-none p-2 rounded-md w-content md:w-3xs bg-sky-200 hover:bg-sky-300 hover:cursor-pointer text-center'
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
