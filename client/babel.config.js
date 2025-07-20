module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env', // This is the module you'll import from
      path: '.env',       // Path to your .env file
      safe: false,        // If true, it will throw an error if .env is missing
      allowUndefined: true, // Allow variables to be undefined
    }]
  ]
};
