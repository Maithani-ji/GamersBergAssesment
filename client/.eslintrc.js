// client/.eslintrc.js
module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false, // <- THIS FIXES YOUR ERROR
    babelOptions: {
      presets: ['module:@react-native/babel-preset'], // match your babel.config.js
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  plugins: ['react', 'react-native'],
  rules: {
    // your custom rules
  },
};
