module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/member-delimiter-style': ['error', { 'multiline': { 'delimiter': 'none' } }],
    '@typescript-eslint/semi': ['error', 'never'],
    'comma-dangle': ['error', 'always-multiline'],
    'indent': ['warn', 2, { 'SwitchCase': 1 }],
    'quotes': ['error', 'single', { avoidEscape: true }],
  },
}
