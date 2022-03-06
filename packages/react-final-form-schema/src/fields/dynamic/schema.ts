/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FormApi,
} from 'final-form';

import type {
  GetFieldSchema,
  GetFieldType,
  PhaseType,
} from '@vtaits/form-schema';

export type DynamicSchema<
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
  ) => FieldSchema;

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
  ) => Promise<FieldSchema>;

  /**
   * callback than called when field has shown
   */
  onShow?: (
    /**
     * instance of `final-form`
     */
    form: FormApi<Values>,
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
  ) => void;

  /**
   * callback than called when field has hidden
   */
  onHide?: (
    /**
     * instance of `final-form`
     */
    form: FormApi<Values>,
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
  ) => void;
};
