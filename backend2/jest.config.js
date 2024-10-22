module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '\\.(test|spec)\\.tsx?$',
  moduleFileExtensions: ['ts', 'ts', 'js', 'js', 'json', 'node'],
  preset: 'ts-jest',
  collectCoverageFrom: ['**/*.ts'],
};
