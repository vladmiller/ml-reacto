module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: [
      '@react-native-community',
      'plugin:@typescript-eslint/recommended',
      'prettier/@typescript-eslint',
      'plugin:prettier/recommended',
    ],
  
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  
    rules: {
      '@typescript-eslint/no-use-before-define': ["error", { "variables": false }],
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        }
      ]
    }
  }