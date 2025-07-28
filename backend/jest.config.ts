import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/__mocks__/'],
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/__mocks__/'],
};

export default config;
