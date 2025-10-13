import { UserProperty } from './GetUsersPropertiesByUserIdResponse.dto';

export interface UpdatePropertyResponse {
  updatedProperty: UserProperty;
  message: string;
}
