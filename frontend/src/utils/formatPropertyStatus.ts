import { PropertyStatuses } from '../types/PropertyFormData';

const formatPropertyStatus = (status: string | undefined): string => {
  switch (status) {
    case PropertyStatuses.AVAILABLE:
      return 'Available';
    case PropertyStatuses.PENDING:
      return 'Pending';
    case PropertyStatuses.SOLD:
      return 'Sold';
    case undefined:
      return 'Property status not defined';
    default:
      return 'Unknown';
  }
};

export default formatPropertyStatus;
