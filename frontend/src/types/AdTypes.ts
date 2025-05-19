import { IconType } from 'react-icons';

export interface AdTypes {
  title: string;
  message: string;
  buttonText: string;
  addToClassName?: string;
  icon: IconType;
  onClick?: () => void;
}
