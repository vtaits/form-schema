import type { GetFieldSchema } from "@vtaits/form-schema";
import {
	type FieldType,
	type GetFieldType,
	useFormSchema,
} from "@vtaits/react-hook-form-schema";
import { checkbox } from "@vtaits/react-hook-form-schema/fields/checkbox";
import { checkboxGroup } from "@vtaits/react-hook-form-schema/fields/checkboxGroup";
import { input } from "@vtaits/react-hook-form-schema/fields/input";
import { radioGroup } from "@vtaits/react-hook-form-schema/fields/radioGroup";
import {
	multiSelect,
	select,
} from "@vtaits/react-hook-form-schema/fields/select";
import { textarea } from "@vtaits/react-hook-form-schema/fields/textarea";
import { Fragment, type ReactElement, useState } from "react";
import { AntdProvider } from "..";

const fieldTypes: Record<string, FieldType<any>> = {
	checkbox,
	checkboxGroup,
	input,
	multiSelect,
	radioGroup,
	select,
	textarea,
};

const getFieldType: GetFieldType<any> = ({ type }) => fieldTypes[type];

const fullSchema: Record<string, any> = {
	checkbox: {
		type: "checkbox",
		checkboxLabel: "Checkbox",
	},

	checkboxGroup: {
		type: "checkboxGroup",
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
	},

	input: {
		type: "input",
		label: "Input",
		placeholder: "Input",
	},

	multiSelect: {
		type: "multiSelect",
		label: "Mulit select",
		placeholder: "Multi select",
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
	},

	radioGroup: {
		type: "radioGroup",
		label: "Radio group",
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
	},

	select: {
		type: "select",
		label: "Select",
		placeholder: "Select",
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
	},

	textarea: {
		type: "textarea",
		label: "Textarea",
		placeholder: "Textarea",
	},
};

const getFieldSchema: GetFieldSchema<any> = (fieldName: string) =>
	fullSchema[fieldName];

const names = Object.keys(fullSchema);

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

export function Simple(): ReactElement {
	const [submittedValues, setSubmittedValues] = useState<Record<
		string,
		any
	> | null>(null);

	const onSubmit = async (
		values: Record<string, any>,
	): Promise<Record<string, any> | null> => {
		setSubmittedValues(null);

		await delay(800);

		const errors: Record<string, any> = {};

		for (const [key, value] of Object.entries(values)) {
			if (!value) {
				errors[key] = "This field is required";
			}
		}

		if (Object.keys(errors).length === 0) {
			setSubmittedValues(values);
			return null;
		}

		if (Object.keys(errors).length === 0) {
			setSubmittedValues(values);
			return null;
		}

		return errors;
	};

	const {
		formState: { isSubmitting },
		handleSubmit,
		renderField,
	} = useFormSchema({
		getFieldSchema,
		getFieldType,
		names,
	});

	return (
		<AntdProvider>
			<form
				className="ant-form ant-form-horizontal"
				onSubmit={handleSubmit(onSubmit)}
			>
				{names.map((fieldName) => (
					<Fragment key={fieldName}>{renderField(fieldName)}</Fragment>
				))}

				<hr />

				<button type="submit" disabled={isSubmitting}>
					Submit
				</button>
			</form>

			{submittedValues && (
				<>
					<hr />

					<h3>Submitted values:</h3>

					<pre>{JSON.stringify(submittedValues, null, 2)}</pre>
				</>
			)}
		</AntdProvider>
	);
}
