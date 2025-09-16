import { UserProperty } from './dtos/GetUsersPropertiesByUserIdResponse';

export interface EditableFieldProps {
  label: string;
  field: keyof UserProperty;
  value: string | number | null | undefined;
  onEdit: (field: keyof UserProperty, value: string | number) => void;
  options?: string[];
  isEdited: boolean;
}
