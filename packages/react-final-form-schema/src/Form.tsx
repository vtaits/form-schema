/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useMemo,
  useCallback,
} from 'react';
import type {
  ReactElement,
} from 'react';
import {
  Form,
} from 'react-final-form';
import type {
  FormProps as FinalFormProps,
} from 'react-final-form';

import {
  serialize as formSchemaSerialize,
  parse as formSchemaParse,
  mapFieldErrors as formSchemaMapFieldErrors,
} from '@vtaits/form-schema';
import type {
  GetFieldSchema,
} from '@vtaits/form-schema';

import type {
  MapErrors,
  FormProps,
  RenderField,
} from './types';

import renderFieldBySchema from './renderFieldBySchema';

export const defaultGetFieldSchema: GetFieldSchema<any> = (fieldSchema) => fieldSchema;
export const defaultMapErrors: MapErrors<any, any, any> = (errors) => errors;

function FormWrapper<
FieldSchema,
Values extends Record<string, any>,
RawValues extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
Payload,
>(
  props: FormProps<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors,
  Payload
  >,
): ReactElement {
  const {
    names,
    getFieldSchema,
    getFieldType,
    initialValues: initialValuesProp,

    onSubmit: onSubmitProp,

    renderFieldBySchema: renderFieldBySchemaProp,
    formSchemaSerialize: serialize,
    formSchemaParse: parse,
    formSchemaMapFieldErrors: mapFieldErrors,

    mapErrors,

    children,

    ...rest
  } = props;

  const initialValues = useMemo(() => parse(
    initialValuesProp || {},
    names,
    getFieldSchema,
    getFieldType,
  ), [
    initialValuesProp,
    names,
    getFieldSchema,
    getFieldType,
  ]);

  const onSubmit = useCallback<FinalFormProps<Values, Values>['onSubmit']>(async (values) => {
    const valuesForSubmit = serialize(values, names, getFieldSchema, getFieldType);

    const rawErrors = await onSubmitProp(valuesForSubmit, values);

    if (!rawErrors) {
      return null;
    }

    const preparedErrors = mapErrors(
      rawErrors as Errors,
      valuesForSubmit,
      values,
    );

    const mappedErrors = mapFieldErrors(
      preparedErrors,
      names,
      getFieldSchema,
      getFieldType,
      valuesForSubmit,
      values,
    );

    return mappedErrors;
  }, [
    onSubmitProp,
    names,
    getFieldSchema,
    getFieldType,
    mapErrors,
  ]);

  const renderField = useCallback<RenderField<Payload>>((name, payload) => renderFieldBySchemaProp(
    getFieldSchema,
    getFieldType,
    name,
    payload,
  ), [
    getFieldSchema,
    getFieldType,
  ]);

  const renderForm = useCallback((formRenderProps) => children({
    ...formRenderProps,
    renderField,
  }), [children, renderField]);

  return (
    <Form
      {...rest}
      onSubmit={onSubmit}
      initialValues={initialValues}
    >
      {renderForm}
    </Form>
  );
}

FormWrapper.defaultProps = {
  initialValues: null,
  getFieldSchema: defaultGetFieldSchema,

  renderFieldBySchema,
  formSchemaSerialize,
  formSchemaParse,
  formSchemaMapFieldErrors,

  mapErrors: defaultMapErrors,
};

export default FormWrapper;
