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

// https://github.com/microsoft/TypeScript/issues/31153#issuecomment-487894895
/* eslint-disable */
type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends { [_ in keyof T]: infer U } ? ({} extends U ? never : U) : never; // I don't know why not just U work here, but ({} extends U ? never : U) work
type OmitFromKnownKeys<T, K extends keyof T> = KnownKeys<T> extends infer U ?
  [U] extends [keyof T] ? Pick<T, Exclude<U, K>> :
  never : never;
type Omit<T, K extends keyof T> = OmitFromKnownKeys<T, K>
  & (string extends K ? {} : (string extends keyof T ? { [n: string]: T[Exclude<keyof T, number>] } : {})) // support number property
  & (number extends K ? {} : (number extends keyof T ? { [n: number]: T[Exclude<keyof T, string>] } : {})) // support number property
/* eslint-enable */

/* eslint-disable @typescript-eslint/no-explicit-any */
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
  & Omit<FinalFormProps<Values, Values>, 'onSubmit' | 'children' | 'initialValues'>
  & {
    /**
     * placeholder runtime values of form during asynchronous initialization
     */
    initialValuesPlaceholder?: Values;
    initialValues?: RawValues;

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

export type FormSchemaStateContextType = {
  /**
   * If parsing if asynchronous it returns true only after end of parsing
   * If parsing if synchronous it always returns true
   */
  isValuesReady: boolean;
};
