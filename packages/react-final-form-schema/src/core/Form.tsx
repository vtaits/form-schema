/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */

import {
  useCallback,
  useMemo,
} from 'react';
import type {
  ReactElement,
  ReactNode,
} from 'react';

import { useAsync } from 'react-async-hook';

import {
  Form as FinalForm,
} from 'react-final-form';
import type {
  FormProps as FinalFormProps,
} from 'react-final-form';

import isPromise from 'is-promise';

import {
  serialize,
  parse,
  validateBeforeSubmit,
  mapFieldErrors,
} from '@vtaits/form-schema';
import type {
  GetFieldSchema,
  ParentType,
} from '@vtaits/form-schema';

import type {
  MapErrors,
  FormProps,
} from './types';

import { renderFieldBySchema } from './renderFieldBySchema';

import {
  IS_VALUES_READY_NAME,
} from './constants';

export const defaultGetFieldSchema: GetFieldSchema<any> = (fieldSchema) => fieldSchema;
export const defaultMapErrors: MapErrors<any, any, any> = (errors) => errors;

export function Form<
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
    initialValuesPlaceholder,

    onSubmit: onSubmitProp,

    mapErrors,

    children,

    ...rest
  } = props;

  const initialValuesResult = useMemo(() => {
    const rawInitialValues = initialValuesProp || {};

    return parse(
      rawInitialValues,
      names,
      getFieldSchema,
      getFieldType,
      [
        {
          values: rawInitialValues,
        },
      ],
    );
  }, [
    initialValuesProp,
    names,
    getFieldSchema,
    getFieldType,
  ]);

  const {
    result: initialValues,
  } = useAsync(
    () => Promise.resolve(initialValuesResult),
    [initialValuesResult],
  );

  const onSubmit = useCallback<FinalFormProps<Values, Values>['onSubmit']>(async (values) => {
    const validationErrors = validateBeforeSubmit(
      values,
      names,
      getFieldSchema,
      getFieldType,
      [
        {
          values,
        },
      ],
    );

    if (Object.keys(validationErrors).length > 0) {
      return validationErrors;
    }

    const valuesForSubmit = serialize(
      values,
      names,
      getFieldSchema,
      getFieldType,
      [
        {
          values,
        },
      ],
    );

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
      [
        {
          values,
        },
      ],
    );

    return mappedErrors;
  }, [
    onSubmitProp,
    names,
    getFieldSchema,
    getFieldType,
    mapErrors,
  ]);

  const renderField = useCallback((
    values: Values,
    name: string,
    payload?: Payload,
    parents?: ParentType<Values>[],
  ): ReactNode => renderFieldBySchema(
    getFieldSchema,
    getFieldType,
    name,
    payload,
    parents || [{
      values,
    }],
  ), [
    getFieldSchema,
    getFieldType,
  ]);

  const renderForm = useCallback<FinalFormProps<Values, Values>['render']>((formRenderProps) => children({
    ...formRenderProps,
    renderField: (
      name: string,
      payload?: Payload,
      parents?: ParentType<Values>[],
    ): ReactNode => renderField(
      formRenderProps.values,
      name,
      payload,
      parents,
    ),
  }), [children, renderField]);

  const providedInitialValues = useMemo(() => {
    const initialValuesClean = isPromise(initialValuesResult)
      ? initialValues
      : initialValuesResult;

    if (initialValuesClean) {
      return {
        ...initialValuesClean,
        [IS_VALUES_READY_NAME]: true,
      };
    }

    return {
      ...initialValuesPlaceholder,
      [IS_VALUES_READY_NAME]: false,
    };
  }, [
    initialValuesResult,
    initialValues,
    initialValuesPlaceholder,
  ]);

  return (
    <FinalForm
      {...rest}
      onSubmit={onSubmit}
      initialValues={providedInitialValues}
    >
      {renderForm}
    </FinalForm>
  );
}

Form.defaultProps = {
  initialValues: null,
  initialValuesPlaceholder: undefined,
  getFieldSchema: defaultGetFieldSchema,
  mapErrors: defaultMapErrors,
};
