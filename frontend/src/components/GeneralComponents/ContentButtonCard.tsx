import { Link } from 'react-router-dom';
import { ContentButtonCardProps } from '../../types/ContentButtonCardProps';
import Button from './Button';

const ContentButtonCard: React.FC<ContentButtonCardProps> = ({
  buttonText,
  backgroundImage,
  addToClassName,
  link,
}) => {
  const cardContent = (
    <div
      className={`relative min-h-[12rem] lg:min-h-[24rem] shadow-md shadow-slate-500 flex flex-1 justify-center items-center rounded-lg bg-cover bg-center hover:scale-[1.02] transition duration-300`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Button
        ClassName={`absolute -top-8 sm:-top-8 md:-top-10 !rounded-b-none text-xl hover:cursor-pointer ${addToClassName}`}
      >
        {buttonText}
      </Button>
    </div>
  );

  return (
    <Link to={link} className='flex-1 min-w-0'>
      {cardContent}
    </Link>
  );
};

export default ContentButtonCard;
