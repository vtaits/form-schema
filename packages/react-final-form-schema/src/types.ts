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
} from '@vtaits/form-schema';
import type {
  FormProps as FinalFormProps,
  FormRenderProps as FinalFormRenderProps,
} from 'react-final-form';
import type {
  ComponentType,
  ReactNode,
} from 'react';

export type GetFieldType<
FieldSchema,
Values extends Record<string, any>,
RawValues extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
Payload,
> = (fieldSchema: FieldSchema) => FieldType<
FieldSchema,
Values,
RawValues,
SerializedValues,
Errors,
Payload
>;

export type RenderField<Payload> = (
  name: string,
  payload?: Payload,
) => ReactNode;

export type FieldComponentProps<
FieldSchema,
Values extends Record<string, any>,
RawValues extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
Payload,
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
  renderField: RenderField<Payload>;
};

export type MapErrors<
Values extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
> = (
  rawErrors: Errors,
  valuesForSubmit: SerializedValues,
  values: Values,
) => Errors;

export type FieldType<
FieldSchema,
Values extends Record<string, any>,
RawValues extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
Payload,
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
Values extends Record<string, any>,
RawValues extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
Payload,
> = (
  values: Values,
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
  payload?: Payload,
) => ReactNode;

export type FormRenderProps<Values extends Record<string, any>, Payload> =
  & FinalFormRenderProps<Values>
  & {
    renderField: RenderField<Payload>;
  };

export type FormProps<
FieldSchema,
Values extends Record<string, any>,
RawValues extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
Payload,
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

    onSubmit: (
      serializedValues: SerializedValues,
      rawValues: Values,
    ) => ReturnType<FinalFormProps<Values, Values>['onSubmit']>;

    children: (renderProps: FormRenderProps<Values, Payload>) => ReactNode;
  };
