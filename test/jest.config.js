// https://jestjs.io/docs/en/configuration
module.exports = {
  bail: 1,
  collectCoverage: true,
  collectCoverageFrom: ['core/index.js'],
  coverageDirectory: 'reports',
  rootDir: '..'
}
