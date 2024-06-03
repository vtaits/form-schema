import isPromise from "is-promise";
import { defaultParser } from "./parse";
import type {
	BaseValues,
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

export function parseSingle<
	FieldSchema,
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
		value: values[name as keyof RawValues],
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
		return parserResult.then(
			(result) => (result as Values)[name as keyof Values],
		);
	}

	return parserResult[name];
}
