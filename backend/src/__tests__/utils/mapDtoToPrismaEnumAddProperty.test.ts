import {
  mapDtoToPrismaEnumAddPropertyType,
  mapDtoToPrismaEnumAddPropertyStatus,
} from '../../utils/mapDtoToPrismaEnumAddProperty';

import { PropertyTypes as PrismaPropertyTypes } from '../../../generated/prisma';
import { PropertyStatus as PrismaPropertyStatus } from '../../../generated/prisma';
import { PropertyTypes as DTOPropertyTypes } from '../../types/dtos/CreateProperty.dto';
import { PropertyStatus as DTOPropertyStatus } from '../../types/dtos/CreateProperty.dto';

describe('mapDtoToPrismaEnumAddPropertyType', () => {
  it('should correctly map DTO property types to Prisma property types', () => {
    expect(mapDtoToPrismaEnumAddPropertyType(DTOPropertyTypes.APARTMENT)).toBe(
      PrismaPropertyTypes.APARTMENT,
    );
    expect(mapDtoToPrismaEnumAddPropertyType(DTOPropertyTypes.COMMERCIAL)).toBe(
      PrismaPropertyTypes.COMMERCIAL,
    );
    expect(mapDtoToPrismaEnumAddPropertyType(DTOPropertyTypes.HOUSE)).toBe(
      PrismaPropertyTypes.HOUSE,
    );
    expect(mapDtoToPrismaEnumAddPropertyType(DTOPropertyTypes.INDUSTRIAL)).toBe(
      PrismaPropertyTypes.INDUSTRIAL,
    );
    expect(mapDtoToPrismaEnumAddPropertyType(DTOPropertyTypes.LAND)).toBe(
      PrismaPropertyTypes.LAND,
    );
    expect(
      mapDtoToPrismaEnumAddPropertyType(DTOPropertyTypes.MISCELLANOUS),
    ).toBe(PrismaPropertyTypes.MISCELLANOUS);
  });

  it('should throw an error for an invalid property type', () => {
    expect(() =>
      mapDtoToPrismaEnumAddPropertyType('INVALID_TYPE' as any),
    ).toThrow('Invalid property type');
  });
});

describe('mapDtoToPrismaEnumAddPropertyStatus', () => {
  it('should correctly map DTO property statuses to Prisma property statuses', () => {
    expect(
      mapDtoToPrismaEnumAddPropertyStatus(DTOPropertyStatus.AVAILABLE),
    ).toBe(PrismaPropertyStatus.AVAILABLE);
    expect(mapDtoToPrismaEnumAddPropertyStatus(DTOPropertyStatus.PENDING)).toBe(
      PrismaPropertyStatus.PENDING,
    );
    expect(mapDtoToPrismaEnumAddPropertyStatus(DTOPropertyStatus.SOLD)).toBe(
      PrismaPropertyStatus.SOLD,
    );
  });

  it('should throw an error for an invalid property status', () => {
    expect(() =>
      mapDtoToPrismaEnumAddPropertyStatus('INVALID_STATUS' as any),
    ).toThrow('Invalid property status');
  });
});
