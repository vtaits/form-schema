import type { Meta, StoryObj } from '@storybook/react';

import { Simple } from '../src/examples/Simple';
import {
  AdaptivityProvider,
  ConfigProvider,
  AppRoot,
} from '@vkontakte/vkui';

const meta: Meta = {
  title: 'react-form-schema-ui-vkui',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const SimpleStory: Story = {
  name: 'Simple',
  args: {
    required: false,
  },
  render: (props) => (
    <ConfigProvider>
    <AdaptivityProvider>
    <AppRoot>
      <Simple {...props} />
    </AppRoot>
    </AdaptivityProvider>
    </ConfigProvider>
  ),
};
