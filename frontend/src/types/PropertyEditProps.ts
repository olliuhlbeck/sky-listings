import { UserProperty } from './dtos/GetUsersPropertiesByUserIdResponse.dto';

export interface PropertyEditProps {
  property: UserProperty;
  originalProperty: UserProperty;
  onPropertyUpdate: (updated: UserProperty) => void;
}
