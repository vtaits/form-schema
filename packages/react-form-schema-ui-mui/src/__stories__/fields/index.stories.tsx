import type { Meta, StoryObj } from "@storybook/react";
import type { CheckboxSchema } from "@vtaits/react-hook-form-schema/fields/checkbox";
import type { CheckboxGroupSchema } from "@vtaits/react-hook-form-schema/fields/checkboxGroup";
import type { DateSchema } from "@vtaits/react-hook-form-schema/fields/date";
import { MuiProvider } from "../..";
import { CheckboxStoryComponent } from "./Checkbox";
import { CheckboxGroupStoryComponent } from "./CheckboxGroup";
import { DateStoryComponent } from "./Date";
import type { DateTimeSchema } from "@vtaits/react-hook-form-schema/fields/datetime";
import { DatetimeStoryComponent } from "./Datetime";

const meta: Meta<typeof MuiProvider> = {
	title: "react-form-schema-ui-mui/fields",
	component: MuiProvider,
};

export default meta;
type Story = StoryObj;

export const CheckboxStory: StoryObj<CheckboxSchema> = {
	name: "Checkbox",
	args: {
		required: false,
		checkboxLabel: "Checkbox",
		disabled: false,
		isValueInverse: false,
	},
	render: (schema) => (
		<MuiProvider>
			<CheckboxStoryComponent {...schema} />
		</MuiProvider>
	),
};

export const CheckboxGroupStory: StoryObj<CheckboxGroupSchema> = {
	name: "Checkbox group",
	args: {
		label: "Checkbox group",
		options: [
			{
				value: "value1",
				label: "Label 1",
			},
			{
				value: "value2",
				label: "Label 2",
			},
			{
				value: "value3",
				label: "Label 3",
			},
		],
		disabled: false,
		required: false,
	},
	render: (schema) => (
		<MuiProvider>
			<CheckboxGroupStoryComponent {...schema} />
		</MuiProvider>
	),
};

export const DateStory: StoryObj<DateSchema> = {
	name: "Date",
	args: {
		required: false,
		label: "Date",
		disabled: false,
		clientDateFormat: '',
		displayDateFormat: '',
		serverDateFormat: '',
		utc: false,
	},
	render: (schema) => (
		<MuiProvider>
			<DateStoryComponent {...schema} />
		</MuiProvider>
	),
};

export const DatetimeStory: StoryObj<DateTimeSchema> = {
	name: "Datetime",
	args: {
		required: false,
		label: "Datetime",
		disabled: false,
		clientDateFormat: '',
		displayDateFormat: '',
		serverDateFormat: '',
		utc: false,
	},
	render: (schema) => (
		<MuiProvider>
			<DatetimeStoryComponent {...schema} />
		</MuiProvider>
	),
};
