module.exports = {
  env: {
    browser: true,
    es2022: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'lines-between-class-members': 'warn',
    'class-methods-use-this': 'warn',
    'no-unused-vars': 'warn',
  },
};
