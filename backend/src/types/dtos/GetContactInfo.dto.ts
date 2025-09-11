export interface ContactInfoReturnDto {
  email: string | null;
  phoneNumber: string | null;
  preferredContactMethod: 'EMAIL' | 'PHONECALL' | 'TEXTMESSAGE' | 'NOTCHOSEN';
}

export interface UserInfoReturnDto {
  address: string | null;
  email: string | null;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  preferredContactMethod: 'EMAIL' | 'PHONECALL' | 'TEXTMESSAGE' | 'NOTCHOSEN';
}

export interface GetContactInfo {
  userId: string;
}

export interface GetUserInfo {
  userId: string;
}
