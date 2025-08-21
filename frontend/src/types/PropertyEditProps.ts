import { PropertyResponse } from './dtos/PropertyResponse.dto';

export interface PropertyEditProps {
  property: PropertyResponse;
  originalProperty: PropertyResponse;
}
