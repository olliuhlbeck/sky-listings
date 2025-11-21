import { MouseEventHandler } from 'react';
import { IconType } from 'react-icons';

export interface ButtonProps {
  ClassName?: string;
  text?: string;
  link?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  icon?: IconType;
  iconSize?: number;
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
  disabled?: boolean;
}
