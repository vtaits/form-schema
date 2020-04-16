/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  ComponentType,
  ReactNode,
} from 'react';

import type {
  FormProps as FinalFormProps,
  FormRenderProps as FinalFormRenderProps,
} from 'react-final-form';

import {
  serialize as formSchemaSerialize,
  parse as formSchemaParse,
  mapFieldErrors as formSchemaMapFieldErrors,
} from '@vtaits/form-schema';
import type {
  GetFieldSchema,
  Errors,
  Values,
  FieldType as FieldTypeBase,
} from '@vtaits/form-schema';

export type GetFieldType = (fieldSchema: any) => FieldType;

export type RenderField = (
  name: string,
  payload?: any,
) => ReactNode;

export type FieldComponentProps = {
  name: string;
  fieldSchema: any;
  payload?: any;
  getFieldSchema: GetFieldSchema;
  getFieldType: GetFieldType;
  renderField: RenderField;
};

export type MapErrors = (
  rawErrors: Errors,
  valuesForSubmit: Values,
  values: Values,
) => Errors;

export type FieldType = FieldTypeBase & {
  component: ComponentType<FieldComponentProps>;
};

export type RenderFieldBySchema = (
  getFieldSchema: GetFieldSchema,
  getFieldType: GetFieldType,
  name: string,
  payload?: any,
) => ReactNode;

export type FormRenderProps = FinalFormRenderProps & {
  renderField: RenderField;
};

export type FormProps = FinalFormProps & {
  names: string[];
  getFieldSchema?: GetFieldSchema;
  getFieldType?: GetFieldType;

  renderFieldBySchema?: RenderFieldBySchema;
  formSchemaSerialize?: typeof formSchemaSerialize;
  formSchemaParse?: typeof formSchemaParse;
  formSchemaMapFieldErrors?: typeof formSchemaMapFieldErrors;
  mapErrors?: MapErrors;

  children: (renderProps: FormRenderProps) => ReactNode;
};
