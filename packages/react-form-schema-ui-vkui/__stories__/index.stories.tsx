import type { Meta, StoryObj } from "@storybook/react";
import { AdaptivityProvider, AppRoot, type CardProps, ConfigProvider } from "@vkontakte/vkui";
import { Simple } from "../src/examples/Simple";

const meta: Meta = {
	title: "react-form-schema-ui-vkui",
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<{
	required: boolean;
	customOptionRender: boolean;
	cardMode: CardProps['mode']
}>;

export const SimpleStory: Story = {
	name: "Simple",
	args: {
		required: false,
		customOptionRender: false,
		cardMode: undefined
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
