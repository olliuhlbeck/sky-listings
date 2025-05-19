import { IconType } from 'react-icons';

export interface AdTypes {
  title: string;
  icon: IconType;
  message: string;
  buttonText: string;
  onClick?: () => void;
}
