import type { FieldSchemaBase } from "@vtaits/form-schema";
import { Fragment, type ReactElement, useMemo, useState } from "react";
import type { LoadOptions } from "select-async-paginate-model";
import { type DefaultFieldSchema, Form } from "../form";

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

function loadSingleOption(value: unknown) {
	if (!value) {
		return null;
	}

	if (typeof value === "object") {
		return value;
	}

	return options.find((option) => option.value === value);
}

export function SetValues({ required }: { required: boolean }): ReactElement {
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
				loadSingleOption,
				required,
			},

			asyncSelect: {
				type: "asyncSelect",
				label: "Async select",
				placeholder: "Async select",
				loadOptions,
				loadSingleOption,
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

		setSubmittedValues({
			...values,
			file: values.file?.name,
		});
		return null;
	};

	return (
		<>
			<Form
				schemas={schemas}
				onSubmit={onSubmit}
				renderActions={({ isSubmitting }) => (
					<button type="submit" disabled={isSubmitting}>
						Submit
					</button>
				)}
				renderFields={({ names, renderField, formApi }) => (
					<>
						{names.map((name) => (
							<Fragment key={name}>{renderField(name)}</Fragment>
						))}

						<hr />

						<button
							type="button"
							onClick={() => {
								formApi.parseAndSetValues({
									asyncMultiSelect: [2, 3],
									asyncSelect: 2,
									checkbox: true,
									checkboxGroup: ["value2", "value3"],
									date: "2025-08-20",
									datetime: "2025-08-29T12:40:00+03:00",
									input: "test",
									inputWithOptions: "foo",
									number: 123,
									list: ["Initial", "not initial"],
									setList: [
										{
											checkbox: true,
											date: "2025-09-06",
										},
										{
											checkbox: false,
											date: "2025-07-30",
										},
									],
									multiSelect: ["value2", "value3"],
									radioGroup: "value2",
									select: "value1",
									tags: ["tag1", "tag2"],
									textarea: "text\narea\nvalue",
								});
							}}
						>
							Set values
						</button>
					</>
				)}
				title="Base UI form"
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
