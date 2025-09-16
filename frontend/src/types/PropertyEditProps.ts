import { UserProperty } from './dtos/GetUsersPropertiesByUserIdResponse';

export interface PropertyEditProps {
  property: UserProperty;
  originalProperty: UserProperty;
  onPropertyUpdate: (updated: UserProperty) => void;
}
