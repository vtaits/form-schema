import type { Meta, StoryObj } from '@storybook/react';

import { Dynamic } from './Dynamic';
import { FormError } from './FormError';
import { SerializerAndParser } from './SerializerAndParser';
import { Simple } from './Simple';
import { ValidateBeforeSubmit } from './ValidateBeforeSubmit';

const meta: Meta = {
  title: 'react-hook-form-schema',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const DynamicStory: Story = {
  name: 'Dynamic fields',
  args: {},
  render: (props) => <Dynamic {...props} />,
};

export const SimpleStory: Story = {
  name: 'Simple',
  args: {},
  render: (props) => <Simple {...props} />,
};

export const FormErrorStory: Story = {
  name: 'Form error',
  args: {},
  render: (props) => <FormError {...props} />,
};

export const SerializerAndParserStory: Story = {
  name: 'Serializer and parser',
  args: {},
  render: (props) => <SerializerAndParser {...props} />,
};

export const ValidateBeforeSubmitStory: Story = {
  name: 'Validate before submit',
  args: {},
  render: (props) => <ValidateBeforeSubmit {...props} />
};
