module.exports = {
  env: {
    jest: true,
    node: true,
  },
  root: true,
  extends: '@react-native',
  rules: {
    "comma-dangle": "off",
    "eol-last": "off",
    "quotes": ["off", "double"]
  }
};