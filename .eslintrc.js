module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/prettier'],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-duplicate-case': 2,
    eqeqeq: ['off'],
    'eol-last': ['error', 'always']
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};