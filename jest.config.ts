import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api'
  },
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(msw|@mswjs|@bundled-es-modules|until-async)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts']
};

export default config;
