import { PropertyTypes as PrismaPropertyTypes } from '../../generated/prisma';
import { PropertyStatus as PrismaPropertyStatus } from '../../generated/prisma';
import { PropertyTypes as DTOPropertyTypes } from '../types/dtos/CreateProperty.dto';
import { PropertyStatus as DTOPropertyStatus } from '../types/dtos/CreateProperty.dto';

const madDtoToPrismaEnumAddPropertyType = (dtoType: DTOPropertyTypes) => {
  switch (dtoType) {
    case DTOPropertyTypes.APARTMENT:
      return PrismaPropertyTypes.APARTMENT;
    case DTOPropertyTypes.COMMERCIAL:
      return PrismaPropertyTypes.COMMERCIAL;
    case DTOPropertyTypes.HOUSE:
      return PrismaPropertyTypes.HOUSE;
    case DTOPropertyTypes.INDUSTRIAL:
      return PrismaPropertyTypes.INDUSTRIAL;
    case DTOPropertyTypes.LAND:
      return PrismaPropertyTypes.LAND;
    case DTOPropertyTypes.MISCELLANOUS:
      return PrismaPropertyTypes.MISCELLANOUS;
    default:
      throw new Error(`Invalid property type: ${dtoType}`);
  }
};

const madDtoToPrismaEnumAddPropertyStatus = (dtoStatus: DTOPropertyStatus) => {
  switch (dtoStatus) {
    case DTOPropertyStatus.AVAILABLE:
      return PrismaPropertyStatus.AVAILABLE;
    case DTOPropertyStatus.PENDING:
      return PrismaPropertyStatus.PENDING;
    case DTOPropertyStatus.SOLD:
      return PrismaPropertyStatus.SOLD;
    default:
      throw new Error(`Invalid property status: ${dtoStatus}`);
  }
};

export {
  madDtoToPrismaEnumAddPropertyType,
  madDtoToPrismaEnumAddPropertyStatus,
};
