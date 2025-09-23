export interface EditProfileInfoFormData {
  address: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  preferredContactMethod: 'EMAIL' | 'PHONECALL' | 'TEXTMESSAGE' | 'NOTCHOSEN';
}
