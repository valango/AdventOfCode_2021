// https://jestjs.io/docs/en/configuration
module.exports = {
  bail: 1,
  collectCoverage: true,
  collectCoverageFrom: ['core/a*.js', 'core/i*.js'],
  coverageDirectory: 'reports',
  rootDir: '..'
}
