// https://jestjs.io/docs/en/configuration
module.exports = {
  bail: 1,
  collectCoverage: true,
  collectCoverageFrom: ['runner/index.js'],
  coverageDirectory: 'reports',
  rootDir: '..'
}
