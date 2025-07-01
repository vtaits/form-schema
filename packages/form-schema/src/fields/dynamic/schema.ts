import type {
	FieldSchemaBase,
	GetFieldSchema,
	GetFieldType,
	ParentType,
	PhaseType,
} from "../../core";

export type DynamicGetDependenciesParams<
	FieldSchema extends FieldSchemaBase,
	Values extends Record<string, any> = Record<string, any>,
	RawValues extends Record<string, any> = Record<string, any>,
	SerializedValues extends Record<string, any> = Record<string, any>,
	Errors extends Record<string, any> = Record<string, any>,
> = {
	/**
	 * object of values of form, type depends from `phase` (2nd argument)
	 */
	values: Values | RawValues;
	/**
	 * current phase
	 */
	phase: PhaseType;
	/**
	 * current `getFieldSchema`
	 */
	getFieldSchema: GetFieldSchema<FieldSchema>;
	/**
	 * global `getFieldType`
	 */
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	/**
	 * stack of parent fields above current field with runtime values
	 */
	parents: readonly ParentType[];
};

export type DynamicGetSchemaParams<
	FieldSchema extends FieldSchemaBase,
	Values extends Record<string, any> = Record<string, any>,
	RawValues extends Record<string, any> = Record<string, any>,
	SerializedValues extends Record<string, any> = Record<string, any>,
	Errors extends Record<string, any> = Record<string, any>,
> = DynamicGetDependenciesParams<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors
> & {
	dependencies: unknown;
};

export type DynamicSchema<
	FormApi,
	FieldSchema extends FieldSchemaBase,
	Values extends Record<string, any> = Record<string, any>,
	RawValues extends Record<string, any> = Record<string, any>,
	SerializedValues extends Record<string, any> = Record<string, any>,
	Errors extends Record<string, any> = Record<string, any>,
> = FieldSchemaBase & {
	/**
	 * Callback that counts dependencies of the field to avoid excess recounts
	 */
	getDependencies: (
		params: DynamicGetDependenciesParams<
			FieldSchema,
			Values,
			RawValues,
			SerializedValues,
			Errors
		>,
	) => unknown;

	/**
	 * Callback that should return schema of field or `null` if field can't be shown
	 */
	getSchema: (
		params: DynamicGetSchemaParams<
			FieldSchema,
			Values,
			RawValues,
			SerializedValues,
			Errors
		>,
	) => FieldSchema | null;

	/**
	 * Async callback that can be used instead of `getSchema` on parsing and render phase
	 */
	getSchemaAsync?: (
		params: DynamicGetSchemaParams<
			FieldSchema,
			Values,
			RawValues,
			SerializedValues,
			Errors
		>,
	) => Promise<FieldSchema | null>;

	/**
	 * callback than called when field has shown
	 */
	onShow?: (
		/**
		 * instance of `final-form`
		 */
		form: FormApi,
		/**
		 * name of field
		 */
		name: string,
		/**
		 * result schema of subfield
		 */
		schema: FieldSchema,
		/**
		 * current `getFieldSchema`
		 */
		getFieldSchema: GetFieldSchema<FieldSchema>,
		/**
		 * global `getFieldType`
		 */
		getFieldType: GetFieldType<
			FieldSchema,
			Values,
			RawValues,
			SerializedValues,
			Errors
		>,
		/**
		 * stack of parent fields above current field with runtime values
		 */
		parents: readonly ParentType[],
	) => void;

	/**
	 * callback than called when field has hidden
	 */
	onHide?: (
		/**
		 * instance of `final-form`
		 */
		form: FormApi,
		/**
		 * name of field
		 */
		name: string,
		/**
		 * current `getFieldSchema`
		 */
		getFieldSchema: GetFieldSchema<FieldSchema>,
		/**
		 * global `getFieldType`
		 */
		getFieldType: GetFieldType<
			FieldSchema,
			Values,
			RawValues,
			SerializedValues,
			Errors
		>,
		/**
		 * stack of parent fields above current field with runtime values
		 */
		parents: readonly ParentType[],
	) => void;
};
