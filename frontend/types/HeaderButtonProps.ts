import { MouseEventHandler } from 'react';
import { IconType } from 'react-icons';

export interface HeaderButtonProps {
  text: string;
  link: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  icon?: IconType;
}
