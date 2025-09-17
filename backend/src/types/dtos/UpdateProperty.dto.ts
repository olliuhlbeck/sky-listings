import { Property } from '../../../generated/prisma';
import { PropertyStatus, PropertyTypes } from './CreateProperty.dto';

export interface UpdatePropertyRequestBody {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string | null;
  country?: string;
  price?: number;
  propertyType?: PropertyTypes;
  propertyStatus?: PropertyStatus;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  description?: string;
  additionalInfo?: string | null;
}

export interface UpdatePropertyResponse {
  updatedProperty: Property;
  message: string;
}
