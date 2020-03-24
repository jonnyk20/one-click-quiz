module.exports = {
  browser: true,
  testMatch: [
    // https://github.com/isaacs/node-glob
    '<rootDir>**/*.test.(js|jsx)'
  ],
  moduleFileExtensions: ['jsx', 'js', 'ts', 'tsx'],
  transform: {
    '\\.(js|jsx|ts|tsx)$': ['ts-jest', 'babel-jest']
  },
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.init.ts'],
  verbose: true
};
