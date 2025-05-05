import React from 'react';
import { IconType } from 'react-icons';

interface IconComponentProps {
  icon: IconType;
  size?: number;
  className?: string;
}

const IconComponent = ({
  icon: Icon,
  size = 24,
  className,
}: IconComponentProps) => {
  return <Icon size={size} className={`${className}`} />;
};

export default IconComponent;
