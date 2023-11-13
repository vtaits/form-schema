import type {
	GetFieldSchema,
	GetFieldType,
	ParentType,
	PhaseType,
} from "../../core";

export type DynamicSchema<
	FormApi,
	FieldSchema,
	Values extends Record<string, any> = Record<string, any>,
	RawValues extends Record<string, any> = Record<string, any>,
	SerializedValues extends Record<string, any> = Record<string, any>,
	Errors extends Record<string, any> = Record<string, any>,
> = {
	/**
	 * Callback that should return schema of field or `null` if field can't be shown
	 */
	getSchema: (
		/**
		 * object of values of form, type depends from `phase` (2nd argument)
		 */
		values: Values | RawValues,
		/**
		 * current phase
		 */
		phase: PhaseType,
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
		parents: readonly ParentType<Values>[],
	) => FieldSchema | null;

	/**
	 * Async callback that can be used instead of `getSchema` on parsing phase
	 */
	getSchemaAsync?: (
		/**
		 * object of values of form, type depends from `phase` (2nd argument)
		 */
		values: Values | RawValues,
		/**
		 * current phase
		 */
		phase: PhaseType,
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
		parents: readonly ParentType<Values>[],
	) => Promise<FieldSchema>;

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
		parents: readonly ParentType<Values>[],
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
		parents: readonly ParentType<Values>[],
	) => void;
};
