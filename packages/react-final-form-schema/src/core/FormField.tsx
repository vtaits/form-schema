import {
  useCallback,
  useContext,
  useMemo,
} from 'react';
import type {
  ReactElement,
} from 'react';

import {
  useContext as useRequiredContext,
} from '@vtaits/react-required-context';

import {
  useForm,
  useFormState,
} from 'react-final-form';

import type {
  GetFieldSchema,
  ParentType,
} from '@vtaits/form-schema';

import { FormFieldContext } from './FormFieldContext';
import { FormSchemaContext } from './FormSchemaContext';

import type {
  GetFieldType,
} from './types';

export type FormFieldProps<
Values extends Record<string, any>,
Payload,
> = {
  name: string;
  payload?: Payload;
  parents?: ParentType<Values>[],
};

export function FormField<
FieldSchema,
Values extends Record<string, any>,
RawValues extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
Payload,
>({
  name,
  payload,
  parents: parentsProp,
}: FormFieldProps<
Values,
Payload
>): ReactElement {
  const form = useForm();

  const {
    values,
  } = useFormState();

  const parents = useMemo(() => {
    if (parentsProp) {
      return parentsProp;
    }

    return [
      {
        values: values as Values,
      },
    ];
  }, [parentsProp, values]);

  const {
    getFieldSchema: getFieldSchemaParam,
    getFieldType: getFieldTypeParam,
  } = useRequiredContext(FormSchemaContext);

  const getFieldType = getFieldTypeParam as GetFieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors,
  Payload
  >;

  const parentFieldContext = useContext(FormFieldContext);

  const getFieldSchema = (
    parentFieldContext
      ? parentFieldContext.getFieldSchema
      : getFieldSchemaParam
  ) as GetFieldSchema<FieldSchema>;

  const fieldSchema = useMemo(
    () => getFieldSchema(name),
    [getFieldSchema, name],
  );

  const fieldType = useMemo(
    () => getFieldType(fieldSchema),
    [getFieldType, fieldSchema],
  );

  const getChildFieldSchema = useMemo(() => {
    const {
      createGetFieldSchema,
    } = fieldType;

    if (createGetFieldSchema) {
      return createGetFieldSchema(
        fieldSchema,
        getFieldSchema,
        getFieldType,
        form.getState().values as Values,
        'render',
        parents,
      );
    }

    return getFieldSchema;
  }, [
    fieldSchema,
    getFieldSchema,
    getFieldType,
    form,
    fieldType,
    parents,
  ]);

  const fieldContextValue = useMemo(() => ({
    getFieldSchema: getChildFieldSchema,
  }), [getChildFieldSchema]);

  const {
    component: FieldComponent,
  } = fieldType;

  return (
    <FormFieldContext.Provider value={fieldContextValue}>
      <FieldComponent
        name={name}
        fieldSchema={fieldSchema}
        payload={payload}
        getFieldSchema={getFieldSchema}
        getFieldType={getFieldType}
        parents={parents}
      />
    </FormFieldContext.Provider>
  );
}

FormField.defaultProps = {
  payload: undefined,
  parents: undefined,
};
