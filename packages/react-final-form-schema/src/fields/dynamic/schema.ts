/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  PhaseType,
} from '@vtaits/form-schema';

export type DynamicSchema<
FieldSchema,
Values extends Record<string, any> = Record<string, any>,
RawValues extends Record<string, any> = Record<string, any>,
> = {
  getSchema: (values: Values | RawValues, phase: PhaseType) => FieldSchema;
};
