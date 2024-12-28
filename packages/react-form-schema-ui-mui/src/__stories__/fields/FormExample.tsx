import Button from "@mui/material/Button";
import type { FieldSchemaBase } from "@vtaits/form-schema";
import {
	type DefaultFieldSchema,
	Form,
} from "@vtaits/react-hook-form-schema/form";
import { Fragment, type ReactElement, type ReactNode, useState } from "react";

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

type IFormExampleProps = Readonly<{
	schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>>;
	title: ReactNode;
	defaultValues?: Record<string, unknown>;
}>;

export function FormExample({
	schemas,
	defaultValues,
	title,
}: IFormExampleProps): ReactElement {
	const [submittedValues, setSubmittedValues] = useState<Record<
		string,
		any
	> | null>(null);

	const onSubmit = async (values: Record<string, any>) => {
		await delay(400);
		setSubmittedValues(
			Object.fromEntries(
				Object.entries(values).map(([key, value]) => {
					if (value instanceof File) {
						return [key, value.name];
					}

					return [key, value];
				}),
			),
		);
		return null;
	};

	return (
		<>
			<Form
				defaultValues={defaultValues}
				schemas={schemas}
				onSubmit={onSubmit}
				renderFields={({ renderField, names }) => (
					<div data-testid="fields">
						{names.map((fieldName) => (
							<Fragment key={fieldName}>{renderField(fieldName)}</Fragment>
						))}
					</div>
				)}
				renderActions={({ isSubmitting }) => (
					<Button variant="contained" type="submit" disabled={isSubmitting}>
						Submit
					</Button>
				)}
				title={title}
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
