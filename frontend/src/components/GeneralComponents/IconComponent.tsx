import { IconType } from 'react-icons';

interface IconComponentProps {
  icon: IconType;
  size?: number;
  className?: string;
  onClick?: () => void;
}

const IconComponent = ({
  icon: Icon,
  size = 24,
  className = '',
  onClick,
}: IconComponentProps) => {
  return <Icon size={size} className={`${className}`} onClick={onClick} />;
};

export default IconComponent;
