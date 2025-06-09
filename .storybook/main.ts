import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';

const config: StorybookConfig = {
  stories: ['../packages/**/*.stories.@(js|jsx|ts|tsx)'],
  framework: '@storybook/react-vite',

  async viteFinal(config) {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      resolve: {
        alias: {
          '@vtaits/form-schema/fields': path.join(__dirname, '../packages/form-schema/src/fields'),
          '@vtaits/form-schema': path.join(__dirname, '../packages/form-schema/src/core'),
          '@vtaits/form-schema-base-ui': path.join(__dirname, '../packages/form-schema-base-ui/src'),
          '@vtaits/react-hook-form-schema/fields': path.join(__dirname, '../packages/react-hook-form-schema/src/fields'),
          '@vtaits/react-hook-form-schema/form': path.join(__dirname, '../packages/react-hook-form-schema/src/form'),
          '@vtaits/react-hook-form-schema': path.join(__dirname, '../packages/react-hook-form-schema/src/core'),
        },
      },
    });
  },
};

export default config;
