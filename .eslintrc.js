module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended', 'airbnb'],
  parser: 'babel-eslint',

  plugins: [
    'react',
    'jest',
  ],

  rules: {
    'arrow-parens': ['error', 'always'],
    'no-plusplus': 'off',
    'no-nested-ternary': 'off',

    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        packageDir: [
          __dirname,
          './packages/form-schema',
          './packages/react-final-form-schema',
        ],

        devDependencies: [
          '**/__tests__/**/*',
          '**/__stories__/**/*',
        ],
      },
    ],

    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'off',
  },
};
