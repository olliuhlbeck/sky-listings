import { PropertyResponse } from './dtos/PropertyResponse.dto';

export interface EditableFieldProps {
  label: string;
  field: keyof PropertyResponse;
  value: string | number | null | undefined;
  onEdit: (field: keyof PropertyResponse, value: string | number) => void;
  options?: string[];
}
