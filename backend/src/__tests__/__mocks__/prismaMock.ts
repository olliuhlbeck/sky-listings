// Create and export separate mock for each used model
export const userMock = {
  create: jest.fn(),
  delete: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
};
export const userInfoMock = {
  findUnique: jest.fn(),
  update: jest.fn(),
};
export const propertyMock = {
  count: jest.fn(),
  create: jest.fn(),
  findMany: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
export const propertyPictureMock = {
  create: jest.fn(),
  deleteMany: jest.fn(),
};

// Export combined mockPack
export const prismaMock = {
  user: userMock,
  userInfo: userInfoMock,
  property: propertyMock,
  propertyPicture: propertyPictureMock,
};
