/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  // Allow Jest to transform MUI v9 and Emotion (they ship as ESM)
  transformIgnorePatterns: [
    '/node_modules/(?!(@mui|@emotion)/)',
  ],
  testMatch: ['<rootDir>/src/__tests__/**/*.test.{ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

module.exports = config;
