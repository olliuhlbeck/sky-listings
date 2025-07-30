export const mockFindUnique = jest.fn();
export const mockCreate = jest.fn();
export const mockUpdate = jest.fn();
export const mockDelete = jest.fn();
export const mockCount = jest.fn();
export const mockFindMany = jest.fn();

export const prismaMock = {
  user: {
    create: mockCreate,
    delete: mockDelete,
    findUnique: mockFindUnique,
    update: mockUpdate,
  },
  property: {
    count: mockCount,
    create: mockCreate,
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    update: mockUpdate,
  },
  propertyPicture: {
    create: mockCreate,
  },
};
