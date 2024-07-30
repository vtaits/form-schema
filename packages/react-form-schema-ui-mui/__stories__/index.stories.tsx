import type { Meta, StoryObj } from '@storybook/react';
import { Simple } from '../src/examples/Simple';
import { OnChangeExample } from '../src/examples/OnChange';
import { MuiProvider } from '../src';

const meta: Meta<typeof MuiProvider> = {
  title: 'react-form-schema-ui-mui',
  tags: ['autodocs'],
  component: MuiProvider,
};

export default meta;
type Story = StoryObj<typeof MuiProvider>;

export const SimpleStory: Story = {
  name: 'Simple',
  args: {},
  render: (props) => <MuiProvider {...props}><Simple /></MuiProvider>,
};

export const OnChangeStory: Story = {
  name: 'Handle field change',
  args: {},
  render: (props) => <MuiProvider {...props}><OnChangeExample /></MuiProvider>,
};
