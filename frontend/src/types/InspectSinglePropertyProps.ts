import { PropertyResponse } from './dtos/PropertyResponse.dto';

export interface InspectSinglePropertyProps {
  property: PropertyResponse;
  onClick?: () => void;
}
