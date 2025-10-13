interface PropertyResponse {
  id: number;
  userId: number;
  street: string;
  city: string;
  state: string;
  country: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  propertyType: string;
  propertyStatus: string;
  description: string;
  additionalInfo: string | null;
  createdAt: Date;
  coverPicture: string | null;
}

export interface GetPropertiesResponse {
  totalCount: number;
  properties: PropertyResponse[];
}
