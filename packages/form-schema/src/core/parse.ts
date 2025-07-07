import type {
	BaseValues,
	FieldSchemaBase,
	GetFieldSchema,
	GetFieldType,
	NameType,
	ParentType,
	Parser,
} from "./types";

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
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, any>,
> = Readonly<{
	values: RawValues | null;
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

export async function parse<
	FieldSchema extends FieldSchemaBase,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, any>,
>({
	values,
	names,
	getFieldSchema,
	getFieldType,
	parents,
}: ParseParams<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors
>): Promise<Values> {
	if (!values) {
		return {} as Values;
	}

	const preparsedValues = await Promise.all(
		names.map(async (name) => {
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
				const singleResult = await parserSingle(params);

				return {
					[name]: singleResult,
				};
			}

			const parser =
				(fieldSchema.parser as typeof fieldType.parser) ||
				fieldType.parser ||
				defaultParser;

			return parser(params);
		}),
	);

	const res = {} as Values;

	for (const parsedValue of preparsedValues) {
		Object.assign(res, parsedValue);
	}

	return res;
}
