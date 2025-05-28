import { ContentButtonCardProps } from '../../types/ContentButtonCardProps';
import Button from './Button';

const ContentButtonCard = ({
  buttonText,
  backgroundImage,
  onClick,
}: ContentButtonCardProps) => {
  return (
    <div
      className={`min-h-[12rem] lg:min-h-[24rem] shadow-lg shadow-slate-500 flex flex-1 justify-center items-center rounded-lg bg-cover bg-center`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Button
        ClassName='w-[16rem] md:w-[20rem] text-2xl hover:cursor-pointer'
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default ContentButtonCard;
