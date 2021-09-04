module.exports = {
  setupFiles: [
    './setup-jest.js',
  ],

  transform: {
    '\\.[jt]sx?$': ['babel-jest', {
      rootMode: 'upward',
    }],
  },
};
