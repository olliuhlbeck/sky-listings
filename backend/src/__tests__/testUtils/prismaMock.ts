export const mockFindUnique = jest.fn();
export const mockCreate = jest.fn();
export const mockUpdate = jest.fn();
export const mockDelete = jest.fn();

export const prismaMock = {
  user: {
    findUnique: mockFindUnique,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
  },
};
