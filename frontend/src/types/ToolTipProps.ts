import { ReactNode } from 'react';

export interface ToolTipProps {
  toolTipText: string;
  children: ReactNode;
  addToClassName?: string;
}
