import type { Meta, StoryObj } from '@storybook/react';

import { Simple } from '../src/examples/Simple';

const meta: Meta = {
  title: 'react-form-schema-ui-antd',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const SimpleStory: Story = {
  name: 'Simple',
  args: {
    required: false,
  },
  render: (props) => <Simple {...props} />,
};
