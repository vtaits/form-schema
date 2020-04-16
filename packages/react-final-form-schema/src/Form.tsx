import React, {
  useMemo,
  useCallback,
} from 'react';
import type {
  FC,
} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
} from 'react-final-form';

import {
  serialize as formSchemaSerialize,
  parse as formSchemaParse,
  mapFieldErrors as formSchemaMapFieldErrors,
} from '@vtaits/form-schema';
import type {
  Errors,
  Values,
  GetFieldSchema,
} from '@vtaits/form-schema';

import type {
  MapErrors,
  FormProps,
  RenderField,
} from './types';

import renderFieldBySchema from './renderFieldBySchema';

export const defaultGetFieldSchema: GetFieldSchema = (fieldSchema) => fieldSchema;
export const defaultMapErrors: MapErrors = (errors) => errors;

const FormWrapper: FC<FormProps> = (props) => {
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

  const initialValues: Values = useMemo(() => parse(
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

  const onSubmit = useCallback(async (values) => {
    const valuesForSubmit: Values = serialize(values, names, getFieldSchema, getFieldType);

    const rawErrors: Errors | void | null = await onSubmitProp(valuesForSubmit, values);

    if (!rawErrors) {
      return null;
    }

    const preparedErrors: Errors = mapErrors(
      rawErrors,
      valuesForSubmit,
      values,
    );
    const mappedErrors: Errors = mapFieldErrors(
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

  const renderField: RenderField = useCallback((name, payload) => renderFieldBySchemaProp(
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
};

FormWrapper.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  initialValues: PropTypes.object,
  getFieldSchema: PropTypes.func,
  getFieldType: PropTypes.func.isRequired,

  names: PropTypes.arrayOf(PropTypes.any).isRequired,

  mapErrors: PropTypes.func,

  renderFieldBySchema: PropTypes.func,
  formSchemaSerialize: PropTypes.func,
  formSchemaParse: PropTypes.func,
  formSchemaMapFieldErrors: PropTypes.func,

  children: PropTypes.func.isRequired,
};

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
