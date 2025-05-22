import { ToolTipProps } from '../../types/ToolTipProps';

const ToolTip: React.FC<ToolTipProps> = ({
  toolTipText,
  children,
  addToClassName,
}) => {
  return (
    <div className='relative group inline-block'>
      {children}
      <div
        role='tooltip'
        aria-label={toolTipText}
        className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-50 text-slate-900 text-xs rounded py-1 px-2 z-10 whitespace-nowrap ${addToClassName}`}
      >
        {toolTipText}
      </div>
    </div>
  );
};

export default ToolTip;
