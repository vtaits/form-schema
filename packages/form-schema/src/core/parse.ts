import isPromise from "is-promise";
import type { GetFieldSchema, GetFieldType, ParentType, Parser } from "./types";

export const defaultParser: Parser<any, any, any, any, any> = ({
	values,
	name,
}) => {
	if (typeof values[name] !== "undefined") {
		return {
			[name]: values[name],
		};
	}

	return {
		[name]: null,
	};
};

export type ParseParams<
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
> = Readonly<{
	values: RawValues | null;
	names: readonly string[];
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

export function parse<
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
>({
	values,
	names,
	getFieldSchema,
	getFieldType,
	parents,
}: ParseParams<FieldSchema, Values, RawValues, SerializedValues, Errors>):
	| Values
	| Promise<Values>
	| null {
	if (!values) {
		return null;
	}

	const res = {} as Values;

	let hasPromise = false;
	const preparsedValues: Array<Values | Promise<Values>> = [];

	for (const name of names) {
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
			const parsedSingle = fieldType.parserSingle(params);

			if (isPromise(parsedSingle)) {
				hasPromise = true;

				preparsedValues.push(
					parsedSingle.then((singleResult) => ({
						[name]: singleResult,
					})) as Promise<Values>,
				);
			} else {
				preparsedValues.push({
					[name]: parsedSingle,
				} as Values);
			}
		} else {
			const parser = fieldType.parser || defaultParser;

			const parserResult = parser(params);

			if (isPromise(parserResult)) {
				hasPromise = true;
			}

			preparsedValues.push(parserResult);
		}
	}

	if (hasPromise) {
		return Promise.all(preparsedValues).then((parsedValues) => {
			for (const parsedValue of parsedValues) {
				Object.assign(res, parsedValue);
			}

			return res;
		});
	}

	for (const parsedValue of preparsedValues as Values[]) {
		Object.assign(res, parsedValue);
	}

	return res;
}
