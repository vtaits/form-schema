import type {
	FieldSchemaBase,
	GetDependenciesParams,
	GetFieldSchema,
	GetFieldType,
	ParentType,
} from "../../core";

export type DynamicGetSchemaParams<
	FieldSchema extends FieldSchemaBase,
	Values extends Record<string, any> = Record<string, any>,
	RawValues extends Record<string, any> = Record<string, any>,
	SerializedValues extends Record<string, any> = Record<string, any>,
	Errors extends Record<string, any> = Record<string, any>,
> = GetDependenciesParams<
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
	) => FieldSchema | null | Promise<FieldSchema | null>;

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
