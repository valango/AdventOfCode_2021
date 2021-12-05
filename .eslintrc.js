//	@link (https://eslint.org/docs/user-guide/configuring)
module.exports = {
  env: {
    es2020: true,
    node: true
  },

  extends: [
    'eslint:recommended'
  ],

  rules: {
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],
    'no-multiple-empty-lines': 'warn',
    'no-trailing-spaces': 'warn',
    'no-console': 'off',
    'no-unreachable': 'warn',
    'no-unused-vars': 'warn'
  }
}
