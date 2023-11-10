import type { Meta, StoryObj } from '@storybook/react';

import { Simple } from './Simple';

const meta: Meta = {
  title: 'react-hook-form-schema',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const SimpleStory: Story = {
  name: 'Simple',
  args: {},
  render: (props) => <Simple {...props} />,
};
