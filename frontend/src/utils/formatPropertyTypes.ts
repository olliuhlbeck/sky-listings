import { PropertyTypes } from '../types/PropertyFormData';

const formatPropertyType = (type: string | undefined): string => {
  switch (type) {
    case PropertyTypes.HOUSE:
      return 'House';
    case PropertyTypes.APARTMENT:
      return 'Apartment';
    case PropertyTypes.COMMERCIAL:
      return 'Commercial';
    case PropertyTypes.LAND:
      return 'Land';
    case PropertyTypes.INDUSTRIAL:
      return 'Industrial';
    case PropertyTypes.MISCELLANEOUS:
      return 'Miscellaneous';
    case undefined:
      return 'Property type not defined.';
    default:
      return 'Unknown';
  }
};

export default formatPropertyType;
