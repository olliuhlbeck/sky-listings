interface UserProperty {
  id: number;
  userId: number;
  street: string;
  city: string;
  state: string | null;
  country: string;
  postalCode: string | null;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  squareMeters: number | null;
  propertyType: string;
  propertyStatus: string;
  description: string | null;
  additionalInfo: string | null;
  createdAt: Date;
}

export interface GetUsersPropertiesByUserIdResponse {
  usersProperties: UserProperty[];
}
