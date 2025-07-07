import { defaultParser } from "./parse";
import type {
	BaseValues,
	FieldSchemaBase,
	GetFieldSchema,
	GetFieldType,
	NameType,
	ParentType,
} from "./types";

export type ParseSingleParams<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, any>,
> = Readonly<{
	values: RawValues | null;
	name: NameType;
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

export async function parseSingle<
	FieldSchema extends FieldSchemaBase,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, any>,
>({
	values,
	name,
	getFieldSchema,
	getFieldType,
	parents,
}: ParseSingleParams<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors
>): Promise<unknown> {
	if (!values) {
		return null;
	}

	const fieldSchema = getFieldSchema(name);
	const fieldType = getFieldType(fieldSchema);

	const dependencies = fieldSchema.getDependencies?.({
		values,
		phase: "parse",
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
				phase: "parse",
				parents,
				dependencies,
			})
		: getFieldSchema;

	const params = {
		value: values[name as keyof RawValues],
		values,
		name,
		fieldSchema,
		getFieldSchema: computedGetFieldSchema,
		getFieldType,
		parents,
		dependencies,
	};

	const parserSingle =
		(fieldSchema.parserSingle as typeof fieldType.parserSingle) ||
		fieldType.parserSingle;

	if (parserSingle) {
		return parserSingle(params);
	}

	const parser =
		(fieldSchema.parser as typeof fieldType.parser) ||
		fieldType.parser ||
		defaultParser;

	const parserResult = await parser(params);

	return parserResult[name];
}
