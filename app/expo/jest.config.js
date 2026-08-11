module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^config/(.*)$': '<rootDir>/config/$1',
    '^@expo/vector-icons/(.*)$': '<rootDir>/jest-icon-subpath.js',
    '\\.(svg)$': '<rootDir>/svgMock.js',
  },
};
