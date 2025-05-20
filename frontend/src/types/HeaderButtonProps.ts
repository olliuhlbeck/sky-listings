import { MouseEventHandler } from 'react';
import { IconType } from 'react-icons';
import { ActionType } from './ActionType';

export interface HeaderButtonProps {
  text: string;
  link: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  icon?: IconType;
  state?: { action: ActionType };
}
