type PreferredContactMethod =
  | 'EMAIL'
  | 'PHONECALL'
  | 'TEXTMESSAGE'
  | 'NOTCHOSEN'
  | undefined;

const formatPreferredContactMethod = (
  method: PreferredContactMethod,
): string => {
  switch (method) {
    case 'EMAIL':
      return 'Email';
    case 'PHONECALL':
      return 'Phone call';
    case 'TEXTMESSAGE':
      return 'Text message';
    case 'NOTCHOSEN':
      return 'Not chosen';
    case undefined:
      return 'Preferred contact method not defined';
    default:
      return 'Preferred contact method not defined';
  }
};

export default formatPreferredContactMethod;
