import { type ReactElement, useState } from "react";
import type { GetFieldSchema } from "@vtaits/form-schema";
import {
	type FieldType,
	type GetFieldType,
	useFormSchema,
} from "@vtaits/react-hook-form-schema";
import { dynamic, type DynamicSchema } from "@vtaits/react-hook-form-schema/fields/dynamic";

type InputSchema = {
	type: "input";
	label?: string;
	placeholder?: string;
	disabled?: boolean;
};

type FieldSchema = InputSchema | DynamicSchema<InputSchema> & {
  type: "dynamic";
};

const fieldTypes: Record<string, FieldType<any>> = {
	input: {
		render: (
			{ name, fieldSchema },
			{ formState: { errors }, register },
		) => {
      const { label, placeholder } = fieldSchema as InputSchema;

      return (
        <div>
          {label && <p>{label}</p>}

          <p>
            <input placeholder={placeholder || ""} {...register(name)} />
          </p>

          {errors[name] && (
            <ul
              style={{
                color: "red",
              }}
            >
              {errors[name].message.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      );
    },
	},

	dynamic,
};

const getFieldType: GetFieldType<FieldSchema> = ({ type }) => fieldTypes[type];

const fullSchema: Record<string, FieldSchema> = {
	firstName: {
		type: "input",
		label: "First name",
		placeholder: "Input your first name",
	},

	lastName: {
		type: "dynamic",

		getSchema: ({
			firstName,
		}: {
			firstName?: string;
		}) => ({
			type: "input",
			label: firstName
				? `Last name of ${firstName}`
				: "INPUT YOUR FIRST NAME FIRST!!!",
			placeholder: "Input your last name",
			disabled: !firstName,
		}),
	},

	wow: {
		type: "dynamic",

		getSchema: ({
			lastName,
		}: {
			lastName?: string;
		}) => {
			if (!lastName) {
				return null;
			}

			return {
				type: "input",
				label: "WOW",
				placeholder: "WOW",
			};
		},

		onShow: (...args) => {
			console.log("onShow", args);
		},

		onHide: (...args) => {
			console.log("onHide", args);
		},
	},
};

const getFieldSchema: GetFieldSchema<FieldSchema> = (fieldName: string) =>
	fullSchema[fieldName];

const names = ["firstName", "lastName", "wow"];

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

export function Dynamic(): ReactElement {
	const [submittedValues, setSubmittedValues] = useState<Record<
		string,
		any
	> | null>(null);

	const onSubmit = async (
		values: Record<string, any>,
	): Promise<Record<string, any> | null> => {
		setSubmittedValues(null);

		await delay(1000);

		setSubmittedValues(values);

		return null;
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
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				{renderField("firstName")}
				{renderField("lastName")}
				{renderField("wow")}

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
		</>
	);
}
