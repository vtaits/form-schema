import type { Meta, StoryObj } from "@storybook/react";
import { AdaptivityProvider, AppRoot, ConfigProvider } from "@vkontakte/vkui";
import { Simple } from "../src/examples/Simple";

const meta: Meta = {
	title: "react-form-schema-ui-vkui",
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SimpleStory: Story = {
	name: "Simple",
	args: {
		required: false,
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
