module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  plugins: [
    'react',
    'jest',
    '@typescript-eslint',
  ],

  parserOptions: {
    project: './tsconfig.eslint.json',
  },

  settings: {
    'import/resolver': {
      typescript: {},
    },
  },

  rules: {
    'arrow-parens': ['error', 'always'],
    'no-plusplus': 'off',
    'no-nested-ternary': 'off',

    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/__tests__/**/*',
          '**/__stories__/**/*',
        ],
      },
    ],

    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'off',

    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    'react/prop-types': 'off',

    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};
