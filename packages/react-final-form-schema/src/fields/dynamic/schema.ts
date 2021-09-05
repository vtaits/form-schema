/* eslint-disable @typescript-eslint/no-explicit-any */
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
  getSchema: (
    values: Values | RawValues,
    phase: PhaseType,
    getFieldSchema: GetFieldSchema<FieldSchema>,
    getFieldType: GetFieldType<
    FieldSchema,
    Values,
    RawValues,
    SerializedValues,
    Errors
    >,
  ) => FieldSchema;
};
