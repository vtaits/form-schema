import isPromise from "is-promise";

import type { GetFieldSchema, GetFieldType, ParentType, Parser } from "./types";

export const defaultParser: Parser<any, any, any, any, any> = (
	values,
	name,
) => {
	if (typeof values[name] !== "undefined") {
		return {
			[name]: values[name],
		};
	}

	return {
		[name]: null,
	};
};

export const parse = <
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
>(
	values: RawValues | null,
	names: string[],
	getFieldSchema: GetFieldSchema<FieldSchema>,
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>,
	parents: ParentType<RawValues>[],
): Values | Promise<Values> | null => {
	if (!values) {
		return null;
	}

	const res = {} as Values;

	let hasPromise = false;
	const preparsedValues: Array<Values | Promise<Values>> = [];

	names.forEach((name) => {
		const fieldSchema = getFieldSchema(name);
		const fieldType = getFieldType(fieldSchema);

		const parser = fieldType.parser || defaultParser;
		const computedGetFieldSchema = fieldType.createGetFieldSchema
			? fieldType.createGetFieldSchema(
					fieldSchema,
					getFieldSchema,
					getFieldType,
					values,
					"parse",
					parents,
			  )
			: getFieldSchema;

		const parserResult = parser(
			values,
			name,
			fieldSchema,
			computedGetFieldSchema,
			getFieldType,
			parents,
		);

		if (isPromise(parserResult)) {
			hasPromise = true;
		}

		preparsedValues.push(parserResult);
	});

	if (hasPromise) {
		return Promise.all(preparsedValues).then((parsedValues) => {
			parsedValues.forEach((parsedValue: Values) => {
				Object.assign(res, parsedValue);
			});

			return res;
		});
	}

	(preparsedValues as Values[]).forEach((parsedValue) => {
		Object.assign(res, parsedValue);
	});

	return res;
};
