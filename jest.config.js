// jest.config.js

module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  moduleNameMapper: {
    /* Handle CSS imports (with CSS modules)
    https://jestjs.io/docs/webpack#mocking-css-modules */
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    /* Handle image imports
    https://jestjs.io/docs/webpack#handling-static-assets */
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',

    '^@/admin/components(.*)$': '<rootDir>/pages/admin/components$1',
    '^@/admin/atoms(.*)$': '<rootDir>/pages/admin/components/atoms$1',
    '^@/admin/layouts(.*)$': '<rootDir>/pages/admin/components/layouts$1',
    '^@/admin/store(.*)$': '<rootDir>/pages/admin/store$1',
    '^@/admin/utils(.*)$': '<rootDir>/pages/admin/utils$1',
    '^@/admin(.*)$': '<rootDir>/pages/admin$1',
    '^@/firebase(.*)$': '<rootDir>/firebase$1',
    '^@/hooks(.*)$': '<rootDir>/hooks$1',
    '^@/layouts(.*)$': '<rootDir>/components/layouts$1',
    '^@/atoms(.*)$': '<rootDir>/components/atoms$1',
    '^@/(.*)$': '<rootDir>/$1'
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    /* Use babel-jest to transpile tests with the next/babel preset
    https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$']
}
