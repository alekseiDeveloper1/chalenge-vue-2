module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.vue$': '@vue/vue3-jest',
      '^.+\\.js$': 'babel-jest',
      '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['js', 'ts', 'vue', 'json'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: [
      '**/src/**/*.test.(js|jsx|ts|tsx)',
    ],
  };