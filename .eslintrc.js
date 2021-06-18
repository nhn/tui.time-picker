module.exports = {
  extends: 'tui',
  parserOptions: {
    ecmaVersion: 3
  },
  env: {
    browser: true,
    jest: true,
    commonjs: true
  },
  globals: {
    tui: true,
    loadFixtures: true
  }
};
