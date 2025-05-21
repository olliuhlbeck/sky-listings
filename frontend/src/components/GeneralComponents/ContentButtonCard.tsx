import { ContentButtonCardProps } from '../../types/ContentButtonCardProps';

const ContentButtonCard = ({
  buttonText,
  backgroundImage,
}: ContentButtonCardProps) => {
  return (
    <div
      className={`min-h-[12rem] lg:min-h-[24rem] shadow-lg shadow-slate-500 flex flex-1 justify-center items-center rounded-lg bg-cover bg-center`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <button className='w-[16rem] md:w-[20rem] text-2xl bg-sky-200 text-slate-900 rounded-md p-2 hover:bg-sky-400 hover:cursor-pointer'>
        {buttonText}
      </button>
    </div>
  );
};

export default ContentButtonCard;
