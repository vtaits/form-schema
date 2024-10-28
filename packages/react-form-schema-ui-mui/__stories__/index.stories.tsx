import type { Meta, StoryObj } from '@storybook/react';
import { Simple } from '../src/examples/Simple';
import { OnChangeExample } from '../src/examples/OnChange';
import { MuiProvider } from '../src';
import { ComponentProps } from 'react';

const meta: Meta<typeof MuiProvider> = {
  title: 'react-form-schema-ui-mui',
  tags: ['autodocs'],
  component: MuiProvider,
};

export default meta;
type Story = StoryObj<ComponentProps<typeof MuiProvider> & {
  required: boolean;
}>;

export const SimpleStory: Story = {
  name: 'Simple',
  args: {
    required: false,
  },
  render: ({
    required,
    ...rest
  }) => <MuiProvider {...rest}><Simple required={required} /></MuiProvider>,
};

export const OnChangeStory: Story = {
  name: 'Handle field change',
  args: {
    required: false,
  },
  render: ({
    required,
    ...rest
  }) => <MuiProvider {...rest}><OnChangeExample required={required} /></MuiProvider>,
};
