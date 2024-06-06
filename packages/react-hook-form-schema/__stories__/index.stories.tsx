import type { Meta, StoryObj } from '@storybook/react';

import { BaseForm } from '../src/examples/BaseForm';
import { Dynamic } from '../src/examples/Dynamic';
import { FieldArray } from '../src/examples/FieldArray';
import { FormError } from '../src/examples/FormError';
import { SerializerAndParser } from '../src/examples/SerializerAndParser';
import { Simple } from '../src/examples/Simple';
import { ValidateBeforeSubmit } from '../src/examples/ValidateBeforeSubmit';

const meta: Meta = {
  title: 'react-hook-form-schema',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const BaseFormStory: Story = {
  name: 'Base form',
  args: {},
  render: (props) => <BaseForm {...props} />,
};

export const DynamicStory: Story = {
  name: 'Dynamic fields',
  args: {},
  render: (props) => <Dynamic {...props} />,
};

export const FieldArrayStory: Story = {
  name: 'Field array',
  args: {},
  render: (props) => <FieldArray {...props} />,
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
