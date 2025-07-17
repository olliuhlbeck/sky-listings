export interface PropertyResponse {
  id: number;
  userId: number;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
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
