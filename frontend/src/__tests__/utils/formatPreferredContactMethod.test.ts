import formatPreferredContactMethod from '../../utils/formatPreferredContactMethod';

// formatPreferredContactMethod enum transformer
describe('formatPreferredContactMethod', () => {
  it('returns "Email" for EMAIL', () => {
    expect(formatPreferredContactMethod('EMAIL')).toBe('Email');
  });

  it('returns "Phone call" for PHONECALL', () => {
    expect(formatPreferredContactMethod('PHONECALL')).toBe('Phone call');
  });

  it('returns "Text message" for TEXTMESSAGE', () => {
    expect(formatPreferredContactMethod('TEXTMESSAGE')).toBe('Text message');
  });

  it('returns "Not chosen" for NOTCHOSEN', () => {
    expect(formatPreferredContactMethod('NOTCHOSEN')).toBe('Not chosen');
  });

  it('returns "Preferred contact method not defined" for undefined', () => {
    expect(formatPreferredContactMethod(undefined)).toBe(
      'Preferred contact method not defined',
    );
  });
});
