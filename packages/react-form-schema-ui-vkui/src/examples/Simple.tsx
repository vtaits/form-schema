import { AppRoot, Button } from "@vkontakte/vkui";
import type { FieldSchemaBase } from "@vtaits/form-schema";
import {
	type DefaultFieldSchema,
	Form,
} from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo, useState } from "react";
import type { LoadOptions } from "select-async-paginate-model";
import { VKUIProvider, VKUIShowProvider } from "..";

type OptionType = {
	value: number;
	label: string;
};

const options: OptionType[] = [];
for (let i = 0; i < 50; ++i) {
	options.push({
		value: i + 1,
		label: `Option ${i + 1}`,
	});
}

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

export const loadOptions: LoadOptions<unknown, unknown> = async (
	search,
	prevOptions,
) => {
	await delay(300);

	let filteredOptions: OptionType[];
	if (!search) {
		filteredOptions = options;
	} else {
		const searchLower = search.toLowerCase();

		filteredOptions = options.filter(({ label }) =>
			label.toLowerCase().includes(searchLower),
		);
	}

	const hasMore = filteredOptions.length > prevOptions.length + 10;
	const slicedOptions = filteredOptions.slice(
		prevOptions.length,
		prevOptions.length + 10,
	);

	return {
		options: slicedOptions,
		hasMore,
	};
};

export function Simple({ required }: { required: boolean }): ReactElement {
	const [submittedValues, setSubmittedValues] = useState<Record<
		string,
		any
	> | null>(null);

	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			asyncMultiSelect: {
				type: "asyncMultiSelect",
				label: "Async multi select",
				placeholder: "Async multi select",
				loadOptions,
				required,
			},

			asyncSelect: {
				type: "asyncSelect",
				label: "Async select",
				placeholder: "Async select",
				loadOptions,
				required,
			},

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
				required,
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

		await delay(800);

		const errors: Record<string, any> = {};

		for (const [key, value] of Object.entries(values)) {
			if (!value) {
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
		<AppRoot>
			<VKUIProvider>
				<Form
					schemas={schemas}
					onSubmit={onSubmit}
					renderActions={({ isSubmitting }) => (
						<Button mode="primary" type="submit" disabled={isSubmitting}>
							Submit
						</Button>
					)}
					title="VKUI integraion form"
				/>
			</VKUIProvider>

			{submittedValues && (
				<>
					<hr />

					<h3>Submitted values:</h3>

					<pre>{JSON.stringify(submittedValues, null, 2)}</pre>

					<hr />

					<VKUIShowProvider>
						<Form
							defaultValues={submittedValues}
							schemas={schemas}
							title="VKUI show form"
						/>
					</VKUIShowProvider>
				</>
			)}
		</AppRoot>
	);
}
