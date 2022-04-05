/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  serialize as formSchemaSerialize,
  parse as formSchemaParse,
  validateBeforeSubmit as formSchemaValidateBeforeSubmit,
  mapFieldErrors as formSchemaMapFieldErrors,
} from '@vtaits/form-schema';
import type {
  GetFieldSchema,
  FieldType as FieldTypeBase,
  ParentType,
} from '@vtaits/form-schema';
import type {
  FormProps as FinalFormProps,
  FormRenderProps as FinalFormRenderProps,
} from 'react-final-form';
import type {
  ComponentType,
  ReactNode,
} from 'react';
import { useAsync } from 'react-async-hook';

export type GetFieldType<
FieldSchema,
Values extends Record<string, any> = Record<string, any>,
RawValues extends Record<string, any> = Record<string, any>,
SerializedValues extends Record<string, any> = Record<string, any>,
Errors extends Record<string, any> = Record<string, any>,
Payload = any,
> = (fieldSchema: FieldSchema) => FieldType<
FieldSchema,
Values,
RawValues,
SerializedValues,
Errors,
Payload
>;

export type RenderField<
Values extends Record<string, any> = Record<string, any>,
Payload = any,
> = (
  name: string,
  payload?: Payload,
  parents?: ParentType<Values>[],
) => ReactNode;

export type FieldComponentProps<
FieldSchema,
Values extends Record<string, any> = Record<string, any>,
RawValues extends Record<string, any> = Record<string, any>,
SerializedValues extends Record<string, any> = Record<string, any>,
Errors extends Record<string, any> = Record<string, any>,
Payload = any,
> = {
  name: string;
  fieldSchema: FieldSchema;
  payload?: Payload;
  getFieldSchema: GetFieldSchema<FieldSchema>;
  getFieldType: GetFieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors,
  Payload
  >;
  renderField: RenderField<Values, Payload>;
  /**
   * stack of parent fields above current field with runtime values
   */
  parents: ParentType<Values>[],
};

export type MapErrors<
Values extends Record<string, any> = Record<string, any>,
SerializedValues extends Record<string, any> = Record<string, any>,
Errors extends Record<string, any> = Record<string, any>,
> = (
  rawErrors: Errors,
  valuesForSubmit: SerializedValues,
  values: Values,
) => Errors;

export type FieldType<
FieldSchema,
Values extends Record<string, any> = Record<string, any>,
RawValues extends Record<string, any> = Record<string, any>,
SerializedValues extends Record<string, any> = Record<string, any>,
Errors extends Record<string, any> = Record<string, any>,
Payload = any,
> =
  & FieldTypeBase<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors
  >
  & {
    component: ComponentType<FieldComponentProps<
    FieldSchema,
    Values,
    RawValues,
    SerializedValues,
    Errors,
    Payload
    >>;
  };

export type RenderFieldBySchema<
FieldSchema,
Values extends Record<string, any> = Record<string, any>,
RawValues extends Record<string, any> = Record<string, any>,
SerializedValues extends Record<string, any> = Record<string, any>,
Errors extends Record<string, any> = Record<string, any>,
Payload = any,
> = (
  getFieldSchema: GetFieldSchema<FieldSchema>,
  getFieldType: GetFieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors,
  Payload
  >,
  name: string,
  payload: Payload | undefined,
  parents: ParentType<Values>[],
) => ReactNode;

export type FormRenderProps<
Values extends Record<string, any> = Record<string, any>,
Payload = any,
> =
  & FinalFormRenderProps<Values>
  & {
    renderField: RenderField<Values, Payload>;
  };

export type FormProps<
FieldSchema,
Values extends Record<string, any> = Record<string, any>,
RawValues extends Record<string, any> = Record<string, any>,
SerializedValues extends Record<string, any> = Record<string, any>,
Errors extends Record<string, any> = Record<string, any>,
Payload = any,
> =
  & FinalFormProps<Values, Values>
  & {
    names: string[];
    getFieldSchema?: GetFieldSchema<FieldSchema>;
    getFieldType?: GetFieldType<
    FieldSchema,
    Values,
    RawValues,
    SerializedValues,
    Errors,
    Payload
    >;

    renderFieldBySchema?: RenderFieldBySchema<
    FieldSchema,
    Values,
    RawValues,
    SerializedValues,
    Errors,
    Payload
    >;
    formSchemaSerialize?: typeof formSchemaSerialize;
    formSchemaParse?: typeof formSchemaParse;
    formSchemaValidateBeforeSubmit?: typeof formSchemaValidateBeforeSubmit;
    formSchemaMapFieldErrors?: typeof formSchemaMapFieldErrors;
    mapErrors?: MapErrors<
    Values,
    SerializedValues,
    Errors
    >;

    useAsync?: typeof useAsync;

    onSubmit: (
      serializedValues: SerializedValues,
      rawValues: Values,
    ) => ReturnType<FinalFormProps<Values, Values>['onSubmit']>;

    children: (renderProps: FormRenderProps<Values, Payload>) => ReactNode;
  };

export type FormSchemaStateContextType = {
  /**
   * If parsing if asynchronous it returns true only after end of parsing
   * If parsing if synchronous it always returns true
   */
  isValuesReady: boolean;
};
