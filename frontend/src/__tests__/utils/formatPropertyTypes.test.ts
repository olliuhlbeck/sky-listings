import formatPropertyType from '../../utils/formatPropertyTypes';
import { PropertyTypes } from '../../types/PropertyFormData';

describe('formatPropertyType', () => {
  it('returns "House" for PropertyTypes.HOUSE', () => {
    expect(formatPropertyType(PropertyTypes.HOUSE)).toBe('House');
  });

  it('returns "Apartment" for PropertyTypes.APARTMENT', () => {
    expect(formatPropertyType(PropertyTypes.APARTMENT)).toBe('Apartment');
  });

  it('returns "Commercial" for PropertyTypes.COMMERCIAL', () => {
    expect(formatPropertyType(PropertyTypes.COMMERCIAL)).toBe('Commercial');
  });

  it('returns "Land" for PropertyTypes.LAND', () => {
    expect(formatPropertyType(PropertyTypes.LAND)).toBe('Land');
  });

  it('returns "Industrial" for PropertyTypes.INDUSTRIAL', () => {
    expect(formatPropertyType(PropertyTypes.INDUSTRIAL)).toBe('Industrial');
  });

  it('returns "Miscellaneous" for PropertyTypes.MISCELLANEOUS', () => {
    expect(formatPropertyType(PropertyTypes.MISCELLANEOUS)).toBe(
      'Miscellaneous',
    );
  });

  it('returns "Property type not defined." for undefined', () => {
    expect(formatPropertyType(undefined)).toBe('Property type not defined.');
  });

  it('returns "Unknown" for unrecognized string', () => {
    expect(formatPropertyType('BOAT' as string)).toBe('Unknown');
  });
});
