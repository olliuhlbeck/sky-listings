import { MouseEventHandler } from 'react';

export interface HeaderButtonProps {
  text: string;
  link: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}
