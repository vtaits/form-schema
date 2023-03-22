module.exports = {
  stories: ['../packages/**/*.stories.mdx'],

  framework: '@storybook/react',

  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-docs',
  ],

  core: {
    builder: '@storybook/builder-vite',
  },

  features: {
    storyStoreV7: true,
  },
};
