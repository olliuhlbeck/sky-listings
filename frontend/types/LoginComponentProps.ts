import { ActionType } from './ActionType';

export interface LoginComponentProps {
  action: ActionType;
  setAction: (action: ActionType) => void;
}
