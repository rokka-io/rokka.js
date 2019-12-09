module.exports = {
  roots: ['<rootDir>'],
  testMatch: ['**/?(*.)+(spec|test).+(ts|js)'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
    '^.+\\.(js)?$': 'babel-jest'
  }
}
