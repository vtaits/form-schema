import type { Meta, StoryObj } from "@storybook/react";
import type { CheckboxSchema } from "@vtaits/react-hook-form-schema/fields/checkbox";
import type { CheckboxGroupSchema } from "@vtaits/react-hook-form-schema/fields/checkboxGroup";
import type { DateSchema } from "@vtaits/react-hook-form-schema/fields/date";
import type { DateTimeSchema } from "@vtaits/react-hook-form-schema/fields/datetime";
import { MuiProvider } from "../..";
import { CheckboxStoryComponent } from "./Checkbox";
import { CheckboxGroupStoryComponent } from "./CheckboxGroup";
import { DateStoryComponent } from "./Date";
import { DatetimeStoryComponent } from "./Datetime";
import { InputStoryComponent } from "./Input";

const meta: Meta<typeof MuiProvider> = {
	title: "react-form-schema-ui-mui/fields",
	component: MuiProvider,
};

export default meta;

export const CheckboxStory: StoryObj<{
	required: boolean;
	checkbox_label: string;
	disabled: boolean;
	is_value_inverse: boolean;
	form_value: undefined;
}> = {
	name: "Checkbox",
	args: {
		required: false,
		checkbox_label: "Checkbox",
		disabled: false,
		is_value_inverse: false,
		form_value: undefined,
	},
	render: ({
		required,
		checkbox_label: checkboxLabel,
		disabled,
		is_value_inverse: isValueInverse,
		form_value: formValue,
	}) => (
		<MuiProvider>
			<CheckboxStoryComponent
				schema={{
					required,
					checkboxLabel,
					disabled,
					isValueInverse,
				}}
				formValue={formValue}
			/>
		</MuiProvider>
	),
};

export const CheckboxGroupStory: StoryObj<
	CheckboxGroupSchema & {
		label: string;
		options: unknown;
		disabled: boolean;
		required: boolean;
		min_length?: number;
		max_length?: number;
		form_value?: unknown;
	}
> = {
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
		min_length: undefined,
		max_length: undefined,
		disabled: false,
		required: false,
		form_value: undefined,
	},
	render: ({
		label,
		options,
		disabled,
		min_length: minLength,
		max_length: maxLength,
		required,
		form_value: formValue,
	}) => (
		<MuiProvider>
			<CheckboxGroupStoryComponent
				schema={{
					label,
					minLength,
					maxLength,
					options,
					disabled,
					required,
				}}
				formValue={formValue}
			/>
		</MuiProvider>
	),
};

export const DateStory: StoryObj<{
	required: boolean;
	label: string;
	disabled: boolean;
	client_date_format: string;
	display_date_format: string;
	server_date_format: string;
	utc: boolean;
	form_value?: unknown;
}> = {
	name: "Date",
	args: {
		required: false,
		label: "Date",
		disabled: false,
		client_date_format: "",
		display_date_format: "",
		server_date_format: "",
		utc: false,
		form_value: undefined,
	},
	render: ({
		required,
		label,
		disabled,
		client_date_format: clientDateFormat,
		display_date_format: displayDateFormat,
		server_date_format: serverDateFormat,
		utc,
		form_value: formValue,
	}) => (
		<MuiProvider>
			<DateStoryComponent
				schema={{
					required,
					label,
					disabled,
					clientDateFormat,
					displayDateFormat,
					serverDateFormat,
					utc,
				}}
				formValue={formValue}
			/>
		</MuiProvider>
	),
};

export const DatetimeStory: StoryObj<{
	required: boolean;
	label: string;
	disabled: boolean;
	client_date_format: string;
	display_date_format: string;
	server_date_format: string;
	utc: boolean;
	form_value?: unknown;
}> = {
	name: "Datetime",
	args: {
		required: false,
		label: "Datetime",
		disabled: false,
		client_date_format: "",
		display_date_format: "",
		server_date_format: "",
		utc: false,
		form_value: undefined,
	},
	render: ({
		required,
		label,
		disabled,
		client_date_format: clientDateFormat,
		display_date_format: displayDateFormat,
		server_date_format: serverDateFormat,
		utc,
		form_value: formValue,
	}) => (
		<MuiProvider>
			<DatetimeStoryComponent
				schema={{
					required,
					label,
					disabled,
					clientDateFormat,
					displayDateFormat,
					serverDateFormat,
					utc,
				}}
				formValue={formValue}
			/>
		</MuiProvider>
	),
};

export const InputStory: StoryObj<{
	required: boolean;
	label: string;
	disabled: boolean;
	is_number: boolean;
	min_length?: number;
	max_length?: number;
	reg_exp?: string;
	form_value?: unknown;
	options?: readonly string[];
}> = {
	name: "Input",
	args: {
		required: false,
		label: "Input",
		reg_exp: "",
		disabled: false,
		is_number: false,
		min_length: undefined,
		max_length: undefined,
		form_value: undefined,
		options: undefined,
	},
	render: ({
		required,
		label,
		is_number: isNumber,
		disabled,
		min_length: minLength,
		max_length: maxLength,
		form_value: formValue,
		reg_exp: regExp,
		options,
	}) => (
		<MuiProvider>
			<InputStoryComponent
				schema={{
					required,
					isNumber,
					minLength,
					maxLength,
					regExp,
					label,
					disabled,
					options: options ? Object.values(options) : undefined,
				}}
				formValue={formValue}
			/>
		</MuiProvider>
	),
};