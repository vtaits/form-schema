import isPromise from "is-promise";
import { defaultParser } from "./parse";
import type { GetFieldSchema, GetFieldType, ParentType } from "./types";

export type ParseSingleParams<
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
> = Readonly<{
	values: RawValues | null;
	name: string;
	getFieldSchema: GetFieldSchema<FieldSchema>;
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	parents: readonly ParentType<RawValues>[];
}>;

export function parseSingle<
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
>({
	values,
	name,
	getFieldSchema,
	getFieldType,
	parents,
}: ParseSingleParams<FieldSchema, Values, RawValues, SerializedValues, Errors>):
	| unknown
	| Promise<unknown>
	| null {
	if (!values) {
		return null;
	}

	const fieldSchema = getFieldSchema(name);
	const fieldType = getFieldType(fieldSchema);

	const computedGetFieldSchema = fieldType.createGetFieldSchema
		? fieldType.createGetFieldSchema({
				fieldSchema,
				getFieldSchema,
				getFieldType,
				values,
				phase: "parse",
				parents,
			})
		: getFieldSchema;

	const params = {
		value: values[name],
		values,
		name,
		fieldSchema,
		getFieldSchema: computedGetFieldSchema,
		getFieldType,
		parents,
	};

	if (fieldType.parserSingle) {
		return fieldType.parserSingle(params);
	}

	const parser = fieldType.parser || defaultParser;

	const parserResult = parser(params);

	if (isPromise(parserResult)) {
		return parserResult.then((result) => (result as Values)[name]);
	}

	return parserResult[name];
}
