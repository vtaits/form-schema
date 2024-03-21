import type { Meta, StoryObj } from '@storybook/react';
import '@vkontakte/vkui/dist/vkui.css';

import { Simple } from '../src/examples/Simple';

const meta: Meta = {
  title: 'react-form-schema-ui-vkui',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const SimpleStory: Story = {
  name: 'Simple',
  args: {},
  render: (props) => <Simple {...props} />,
};
