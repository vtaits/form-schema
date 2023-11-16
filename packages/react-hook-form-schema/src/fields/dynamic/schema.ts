import type { DynamicSchema as DynamicSchemaBase } from "@vtaits/form-schema/fields/dynamic";
import type { UseFormReturn } from "react-hook-form";

export type DynamicSchema<
	FieldSchema,
	Values extends Record<string, any> = Record<string, any>,
	RawValues extends Record<string, any> = Record<string, any>,
	SerializedValues extends Record<string, any> = Record<string, any>,
	Errors extends Record<string, any> = Record<string, any>,
> = DynamicSchemaBase<
	UseFormReturn<Values, any, Values>,
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors
>;
