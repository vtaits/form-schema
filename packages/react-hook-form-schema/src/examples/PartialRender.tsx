import type { FieldSchemaBase } from "@vtaits/form-schema";
import { type ReactElement, useMemo, useState } from "react";
import { type DefaultFieldSchema, Form } from "../form";

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

export function PartialRender(): ReactElement {
	const [submittedValues, setSubmittedValues] = useState<Record<
		string,
		any
	> | null>(null);

	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			user: {
				type: "set",
				nested: true,
				schemas: {
					firstName: {
						type: "input",
						label: "First name",
						required: true,
					},

					lastName: {
						type: "input",
						label: "Last name",
						required: true,
					},

					middleName: {
						type: "input",
						label: "Middle name",
					},

					params: {
						type: "set",
						nested: true,

						schemas: {
							age: {
								type: "input",
								label: "Age",
								required: true,
								isNumber: true,
							},

							sex: {
								type: "select",
								label: "Sex",
								options: [
									{
										value: "male",
										label: "Male",
									},
									{
										value: "female",
										label: "Female",
									},
								],
							},
						},
					},
				},
			},
		}),
		[],
	);

	const onSubmit = async (
		values: Record<string, any>,
	): Promise<Record<string, any> | null> => {
		setSubmittedValues(null);

		await delay(800);

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
				renderFields={({ renderField }) => (
					<>
						{renderField("user", {
							renderPath: ["firstName"],
						})}

						<hr />

						{renderField("user", {
							renderPath: ["lastName"],
						})}

						<hr />

						{renderField("user", {
							renderPath: ["middleName"],
						})}

						<hr />

						{renderField("user", {
							renderPath: ["params", "age"],
						})}

						<hr />

						{renderField("user", {
							renderPath: ["params", "sex"],
						})}

						<hr />
					</>
				)}
				renderActions={({ isSubmitting }) => (
					<button type="submit" disabled={isSubmitting}>
						Submit
					</button>
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
