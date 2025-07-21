export interface ContactInfoReturnDto {
  phoneNumber: string | null;
  email: string | null;
  preferredContactMethod: 'EMAIL' | 'PHONECALL' | 'TEXTMESSAGE' | 'NOTCHOSEN';
}

export interface GetContactInfo {
  userId: string;
}
