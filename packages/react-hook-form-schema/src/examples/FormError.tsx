import type { FieldSchemaBase, GetFieldSchema } from "@vtaits/form-schema";
import type { ReactElement } from "react";
import { type GetFieldType, useFormSchema } from "../core";

const getFieldType: GetFieldType<FieldSchemaBase> = () => ({
	render: () => null,
});

const getFieldSchema: GetFieldSchema<FieldSchemaBase> = () => ({});

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

export function FormError(): ReactElement {
	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		setError,
	} = useFormSchema({
		getFieldSchema,
		getFieldType,
		names: [],
	});

	const onSubmit = async (): Promise<void> => {
		await delay(800);

		setError("root", {
			type: "serverError",
			message: "Error",
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{errors.root && (
				<div>
					<p
						style={{
							color: "red",
						}}
					>
						{errors.root.message}
					</p>
				</div>
			)}

			<button type="submit" disabled={isSubmitting}>
				Submit
			</button>
		</form>
	);
}
