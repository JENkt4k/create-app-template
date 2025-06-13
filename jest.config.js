module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
  testMatch: ['**/cli/__tests__/**/*.test.js'],
  rootDir: '.',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};