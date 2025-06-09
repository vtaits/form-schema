import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { MuiProvider } from "..";
import { OnChangeExample } from "./OnChange";
import { Simple } from "./Simple";

const meta: Meta<typeof MuiProvider> = {
	title: "react-form-schema-ui-mui",
	tags: ["autodocs"],
	component: MuiProvider,
};

export default meta;
type Story = StoryObj<
	ComponentProps<typeof MuiProvider> & {
		required: boolean;
	}
>;

export const SimpleStory: Story = {
	name: "Simple",
	args: {
		required: false,
	},
	render: ({ required, ...rest }) => (
		<MuiProvider {...rest}>
			<Simple required={required} />
		</MuiProvider>
	),
};

export const OnChangeStory: Story = {
	name: "Handle field change",
	render: (params) => (
		<MuiProvider {...params}>
			<OnChangeExample />
		</MuiProvider>
	),
};
