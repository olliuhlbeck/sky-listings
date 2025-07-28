import formatPropertyStatus from '../../utils/formatPropertyStatus';
import { PropertyStatuses } from '../../types/PropertyFormData';

describe('formatPropertyStatus', () => {
  it('returns "Available" for PropertyStatuses.AVAILABLE', () => {
    expect(formatPropertyStatus(PropertyStatuses.AVAILABLE)).toBe('Available');
  });

  it('returns "Pending" for PropertyStatuses.PENDING', () => {
    expect(formatPropertyStatus(PropertyStatuses.PENDING)).toBe('Pending');
  });

  it('returns "Sold" for PropertyStatuses.SOLD', () => {
    expect(formatPropertyStatus(PropertyStatuses.SOLD)).toBe('Sold');
  });

  it('returns "Property status not defined" for undefined', () => {
    expect(formatPropertyStatus(undefined)).toBe('Property status not defined');
  });

  it('returns "Unknown" for unrecognized string', () => {
    expect(formatPropertyStatus('DELISTED')).toBe('Unknown');
  });
});
