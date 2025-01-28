import Button from "@mui/material/Button";
import type { FieldSchemaBase } from "@vtaits/form-schema";
import {
	type DefaultFieldSchema,
	Form,
} from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo, useState } from "react";

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

export function Simple({
	required,
}: {
	required: boolean;
}): ReactElement {
	const [submittedValues, setSubmittedValues] = useState<Record<
		string,
		any
	> | null>(null);

	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			checkbox: {
				type: "checkbox",
				checkboxLabel: "Checkbox",
				required,
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
				required,
			},

			date: {
				type: "date",
				label: "Date",
				required,
			},

			datetime: {
				type: "datetime",
				label: "Datetime",
				serverDateFormat: "yyyy-MM-dd HH:mm",
				required,
				serverDateFormat: "yyyy-MM-dd HH:mm",
			},

			file: {
				type: "file",
				label: "File",
				required,
			},

			input: {
				type: "input",
				label: "Input",
				inputProps: {
					placeholder: "Input",
				},
				autoFocus: true,
				required,
			},

			inputWithOptions: {
				type: "input",
				label: "Input with options",
				inputProps: {
					placeholder: "Input with options",
				},
				options: ["foo", "bar"],
				required,
			},

			number: {
				type: "input",
				label: "Number",
				isNumber: true,
				inputProps: {
					placeholder: "Numeric input",
				},
				options: ["123", "456"],
				required,
			},

			list: {
				type: "list",
				label: "List",
				getBlockLabel: (index: number) => `Block #${index + 1}`,
				initialItem: "Initial",
				itemSchema: {
					label: "Input",
					type: "input",
				},
				required,
			},

			setList: {
				type: "list",
				label: "List of sets",
				getBlockLabel: (index: number) => `Block #${index + 1}`,
				itemSchema: {
					type: "set",
					nested: true,
					schemas: {
						checkbox: {
							type: "checkbox",
							checkboxLabel: "Checkbox",
						},

						date: {
							label: "Date",
							type: "date",
						},
					},
				},
				required,
			},

			multiSelect: {
				type: "multiSelect",
				label: "Multi select",
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
				required,
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
				required,
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
				required,
			},

			tags: {
				type: "tags",
				label: "Tags",
				options: ["foo", "bar"],
				required,
			},

			textarea: {
				type: "textarea",
				label: "Textarea",
				textAreaProps: {
					placeholder: "Textarea",
				},
				required,
			},
		}),
		[required],
	);

	const onSubmit = async (
		values: Record<string, any>,
	): Promise<Record<string, any> | null> => {
		setSubmittedValues(null);

		await delay(400);

		const errors: Record<string, any> = {};

		for (const [key, value] of Object.entries(values)) {
			if (!value || (Array.isArray(value) && value.length === 0)) {
				errors[key] = "This field is required";
			}
		}

		if (Object.keys(errors).length === 0) {
			setSubmittedValues({
				...values,
				file: values.file?.name,
			});
			return null;
		}

		errors.error = "There are errors in the form";

		return errors;
	};

	return (
		<>
			<Form
				schemas={schemas}
				onSubmit={onSubmit}
				renderActions={({ isSubmitting }) => (
					<Button variant="contained" type="submit" disabled={isSubmitting}>
						Submit
					</Button>
				)}
				title="Mui integraion form"
			/>

			{submittedValues && (
				<>
					<hr />

					<h3>Submitted values:</h3>

					<pre>{JSON.stringify(submittedValues, null, 2)}</pre>
				</>
			)}
		</>
	);
}
