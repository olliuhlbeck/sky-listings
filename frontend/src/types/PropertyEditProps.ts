import { PropertyResponse } from './dtos/PropertyResponse.dto';

export interface PropertyEditProps {
  property: PropertyResponse;
  originalProperty: PropertyResponse;
  onFieldEdit: (
    field: keyof PropertyResponse,
    value: string | number | null,
  ) => void;
}
