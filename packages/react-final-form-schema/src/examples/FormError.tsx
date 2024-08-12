import type { FieldSchemaBase, GetFieldSchema } from "@vtaits/form-schema";
import { FORM_ERROR } from "final-form";
import type { ReactElement, ReactNode } from "react";
import { Form, type GetFieldType, type MapErrors } from "../core";

function EmptyComponent(): ReactElement {
	return <div />;
}

const getFieldType: GetFieldType<FieldSchemaBase> = () => ({
	component: EmptyComponent,
});

const getFieldSchema: GetFieldSchema<FieldSchemaBase> = () => ({});

const names: readonly string[] = [];

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

const mapErrors: MapErrors = (rawErrors) => {
	if (rawErrors.formError) {
		const { formError, ...rest } = rawErrors;

		return {
			...rest,
			[FORM_ERROR]: formError,
		};
	}

	return rawErrors;
};

export function FormError(): ReactElement {
	const onSubmit = async (): Promise<Record<string, any>> => {
		await delay(800);

		return {
			formError: "Error",
		};
	};

	return (
		<Form
			mapErrors={mapErrors}
			getFieldSchema={getFieldSchema}
			getFieldType={getFieldType}
			names={names}
			onSubmit={onSubmit}
		>
			{({ handleSubmit, submitting, submitError }): ReactNode => (
				<form onSubmit={handleSubmit}>
					{submitError && (
						<p
							style={{
								color: "red",
							}}
						>
							{submitError}
						</p>
					)}

					<button type="submit" disabled={submitting}>
						Submit
					</button>
				</form>
			)}
		</Form>
	);
}
