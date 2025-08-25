import type {
	BaseValues,
	FieldSchemaBase,
	GetFieldSchema,
	GetFieldType,
	NameType,
	ParentType,
	ValueSetter,
} from "./types";

export const defaultValueSetter: ValueSetter<any, any, any, any, any> = ({
	setValue,
	value,
	name,
	parents,
}) => {
	if (typeof value === "undefined") {
		return;
	}

	const prefix = parents
		.filter((parent) => typeof parent.name !== "undefined")
		.map((parent) => parent.name)
		.join(".");

	setValue(prefix ? `${prefix}.${name}` : `${name}`, value);
};

export type SetValuesParams<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, any>,
> = Readonly<{
	setValue: (name: string, value: unknown) => void;
	values: Values;
	names: readonly NameType[];
	getFieldSchema: GetFieldSchema<FieldSchema>;
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	parents: readonly ParentType[];
}>;

export async function setValues<
	FieldSchema extends FieldSchemaBase,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, any>,
>({
	setValue,
	values,
	names,
	getFieldSchema,
	getFieldType,
	parents,
}: SetValuesParams<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors
>): Promise<void> {
	await Promise.all(
		names.map(async (name) => {
			const fieldSchema = getFieldSchema(name);
			const fieldType = getFieldType(fieldSchema);

			const dependencies = fieldSchema.getDependencies?.({
				values,
				phase: "render",
				getFieldSchema,
				getFieldType: getFieldType as unknown as GetFieldType<
					FieldSchemaBase,
					BaseValues,
					BaseValues,
					BaseValues,
					Record<string, any>
				>,
				parents,
			});

			const computedGetFieldSchema = fieldType.createGetFieldSchema
				? await fieldType.createGetFieldSchema({
						fieldSchema,
						getFieldSchema,
						getFieldType,
						values,
						phase: "render",
						parents,
						dependencies,
					})
				: getFieldSchema;

			const params = {
				setValue,
				value: values[name as keyof Values],
				values,
				name,
				fieldSchema,
				getFieldSchema: computedGetFieldSchema,
				getFieldType,
				parents,
				dependencies,
			};

			const valueSetter =
				(fieldSchema.valueSetter as typeof fieldType.valueSetter) ||
				fieldType.valueSetter ||
				defaultValueSetter;

			valueSetter(params);
		}),
	);
}
