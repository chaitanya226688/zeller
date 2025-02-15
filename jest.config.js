module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '\\.png$': '<rootDir>/__mocks__/fileMock.js',
    '\\.jpg$': '<rootDir>/__mocks__/fileMock.js',
    '\\.jpeg$': '<rootDir>/__mocks__/fileMock.js',
    '\\.svg$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFiles: ['<rootDir>/jsSetup.js']
};