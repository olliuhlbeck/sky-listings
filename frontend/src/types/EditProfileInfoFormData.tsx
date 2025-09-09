export interface EditProfileInfoFormData {
  address: string;
  email: string;
  firstName: string;
  lastName: string;
  preferredContactMethod: 'EMAIL' | 'PHONECALL' | 'TEXTMESSAGE' | 'NOTCHOSEN';
}
