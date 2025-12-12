import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/__mocks__/',
    '/generated/prisma',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/__mocks__/',
    '/generated/prisma',
  ],
  modulePathIgnorePatterns: ['/dist/'],
};

export default config;
