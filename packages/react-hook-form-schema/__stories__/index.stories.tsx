import type { Meta, StoryObj } from '@storybook/react';

import { BaseForm } from '../src/examples/BaseForm';
import { Dynamic } from '../src/examples/Dynamic';
import { FieldArray } from '../src/examples/FieldArray';
import { FormError } from '../src/examples/FormError';
import { SerializerAndParser } from '../src/examples/SerializerAndParser';
import { Simple } from '../src/examples/Simple';
import { RedefineRender } from '../src/examples/RedefineRender';
import { ValidateBeforeSubmit } from '../src/examples/ValidateBeforeSubmit';
import { PartialRender } from '../src/examples/PartialRender';

const meta: Meta = {
  title: 'react-hook-form-schema',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const BaseFormStory: Story = {
  name: 'Base form',
  args: {
    required: false,
  },
  render: (props) => <BaseForm {...props} />,
};

export const DynamicStory: StoryObj<{
  default_values?: Record<string, unknown>,
}> = {
  name: 'Dynamic fields',
  args: {
    default_values: undefined,
  },
  render: ({
    default_values: defaultValues
  }) => <Dynamic defaultValues={defaultValues} />,
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

export const RedefineRenderStory: Story = {
  name: 'Redefine render',
  args: {},
  render: (props) => <RedefineRender {...props} />
};

export const PartialRenderStory: Story = {
  name: 'Partial render',
  args: {},
  render: () => <PartialRender />
};
