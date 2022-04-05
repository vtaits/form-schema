/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { useField } from 'react-final-form';
import { ARRAY_ERROR } from 'final-form';
import { Fragment, useState } from 'react';
import type {
  ReactElement,
  ReactNode,
} from 'react';
// eslint-disable-next-line import/order
import {
  serialize,
  parse,
  mapFieldErrors,
} from '@vtaits/form-schema';
import type {
  GetFieldSchema,
} from '@vtaits/form-schema';

import { Form } from '@vtaits/react-final-form-schema';
import type {
  RenderField,
  FieldType,
  FieldComponentProps,
  GetFieldType,
} from '@vtaits/react-final-form-schema';

type FieldArraySchema = {
  type: 'array';
  label: string;
  fields: Record<string, FieldSchema>;
  initialValues?: Record<string, any>;
  names: string[];
};

type ArrayProps = FieldComponentProps<FieldSchema>;

function ArrayComponent({
  name,

  fieldSchema,

  renderField,

  parents,
}: ArrayProps): ReactElement {
  const {
    label,
    names,
    initialValues,
  } = fieldSchema as FieldArraySchema;

  const {
    fields,

    meta: {
      dirtySinceLastSubmit,
      submitError,
    },
  } = useFieldArray(name);

  return (
    <>
      {
        label && (
          <h3>
            {label}
          </h3>
        )
      }

      {
        fields.map((namePrefix, index) => {
          const currrentValues = (fields.value || [])[index] || {};
          return (
            <div
              key={namePrefix}
            >
              {
                names.map((fieldName) => (
                  <Fragment
                    key={fieldName}
                  >
                    {renderField(
                      fieldName,
                      namePrefix,
                      [
                        ...parents,
                        {
                          name: index,
                          values: currrentValues,
                        },
                      ],
                    )}
                  </Fragment>
                ))
              }

              <button
                type="button"
                onClick={(): void => {
                  fields.remove(index);
                }}
              >
                Remove
              </button>

              <hr />
            </div>
          );
        })
      }

      <button
        type="button"
        onClick={(): void => {
          fields.push(initialValues || {});
        }}
      >
        Add
      </button>

      {
        !dirtySinceLastSubmit && submitError && submitError[ARRAY_ERROR] && (
          <ul
            style={{
              color: 'red',
            }}
          >
            {
              submitError[ARRAY_ERROR].map((message, index) => (
                <li key={index}>
                  {message}
                </li>
              ))
            }
          </ul>
        )
      }
    </>
  );
}

type InputSchema = {
  type: 'input';
  label?: string;
  placeholder?: string;
};

type InputProps = {
  name: string;
  fieldSchema: FieldSchema;
  payload?: string;
};

function InputComponent({
  name: nameProp,

  fieldSchema,

  payload,
}: InputProps): ReactElement {
  const {
    label,
    placeholder,
  } = fieldSchema as InputSchema;

  const name = payload
    ? `${payload}.${nameProp}`
    : nameProp;

  const {
    input: {
      value,
      onChange,
    },

    meta: {
      dirtySinceLastSubmit,
      submitError,
    },
  } = useField(name);

  return (
    <div>
      {
        label && (
          <p>
            {label}
          </p>
        )
      }

      <p>
        <input
          name={name}
          value={value || ''}
          placeholder={placeholder || ''}
          onChange={onChange}
        />
      </p>

      {
        !dirtySinceLastSubmit && submitError && (
          <ul
            style={{
              color: 'red',
            }}
          >
            {
              submitError.map((message, index) => (
                <li key={index}>
                  {message}
                </li>
              ))
            }
          </ul>
        )
      }
    </div>
  );
}

InputComponent.defaultProps = {
  payload: null,
};

type FieldSchema = FieldArraySchema | InputSchema;
type Values = Record<string, any>;
type Errors = Record<string, any>;

const fieldTypes: Record<string, FieldType<
FieldSchema,
Values,
Values,
Values,
Errors,
string
>> = {
  array: {
    component: ArrayComponent,

    createGetFieldSchema: (schema) => {
      const {
        fields,
      } = schema as FieldArraySchema;
      const getChildFieldSchema: GetFieldSchema<FieldSchema> = (name: string) => fields[name];

      return getChildFieldSchema;
    },

    serializer: (
      values,
      name,
      schema,
      getFieldSchema,
      getFieldType,
      parents,
    ) => {
      const {
        names,
      } = schema as FieldArraySchema;

      const arrayValues = values[name];

      if (!arrayValues) {
        return {
          [name]: [],
        };
      }

      return {
        [name]: (arrayValues as Values[]).map(
          (arrayValue, index) => serialize(
            arrayValue || {},
            names,
            getFieldSchema,
            getFieldType,
            [
              ...parents,
              {
                name: index,
                values: arrayValue || {},
              },
            ],
          ),
        ),
      };
    },

    parser: (
      values,
      name,
      schema,
      getFieldSchema,
      getFieldType,
      parents,
    ) => {
      const {
        names,
      } = schema as FieldArraySchema;

      const arrayValues = values[name];

      if (!arrayValues || arrayValues.length === 0) {
        return {
          [name]: [
            parse(
              {},
              names,
              getFieldSchema,
              getFieldType,
              [
                ...parents,
                {
                  name: 0,
                  values: {},
                },
              ],
            ),
          ],
        };
      }

      return {
        [name]: (arrayValues as Values[]).map(
          (arrayValue, index) => parse(
            arrayValue || {},
            names,
            getFieldSchema,
            getFieldType,
            [
              ...parents,
              {
                name: index,
                values: arrayValue || {},
              },
            ],
          ),
        ),
      };
    },

    errorsMapper: (
      errors,
      name,
      schema,
      getFieldSchema,
      getFieldType,
      values,
      rawValues,
      parents,
    ) => {
      const {
        names,
      } = schema as FieldArraySchema;

      const arrayErrors = errors[name];

      if (!arrayErrors) {
        return {};
      }

      if (arrayErrors instanceof Array && typeof arrayErrors[0] === 'string') {
        return {
          [name]: {
            [ARRAY_ERROR]: arrayErrors,
          },
        };
      }

      return {
        [name]: (arrayErrors as Errors[]).map(
          (arrayError, index) => mapFieldErrors(
            arrayError || {},
            names,
            getFieldSchema,
            getFieldType,
            values,
            rawValues,
            [
              ...parents,
              {
                name: index,
                values: rawValues,
              },
            ],
          ),
        ),
      };
    },
  },

  input: {
    component: InputComponent,
  },
};

const getFieldType: GetFieldType<
FieldSchema,
Values,
Values,
Values,
Errors,
string
> = ({ type }) => fieldTypes[type];

const fullSchema = {
  users: {
    type: 'array',

    label: 'Users',

    initialValues: {
      firstName: '',
      lastName: '',
    },

    fields: {
      firstName: {
        type: 'input',
        label: 'First name',
        placeholder: 'Input first name',
      },

      lastName: {
        type: 'input',
        label: 'Last name',
        placeholder: 'Input last name',
      },
    },

    names: ['firstName', 'lastName'],
  },
};

const getFieldSchema: GetFieldSchema<FieldSchema> = (fieldName: string) => fullSchema[fieldName];

const names: string[] = ['users'];

const delay = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

export function FieldArray(): ReactElement {
  const [submittedValues, setSubmittedValues] = useState(null);

  const onSubmit = async (values): Promise<Errors> => {
    setSubmittedValues(null);

    await delay(1000);

    const errors: Errors = {};

    if (values.users.length === 0) {
      errors.users = ['This field is required'];
    } else {
      let hasError = false;
      const usersErrors = [];

      values.users.forEach(({
        firstName,
        lastName,
      }, index) => {
        if (!firstName || !lastName) {
          hasError = true;
          const errorObj: Record<string, any> = {};

          if (!firstName) {
            errorObj.firstName = ['This field is required'];
          }

          if (!lastName) {
            errorObj.lastName = ['This field is required'];
          }

          usersErrors[index] = errorObj;
        }
      });

      if (hasError) {
        errors.users = usersErrors;
      }
    }

    if (Object.keys(errors).length === 0) {
      setSubmittedValues(values);
      return null;
    }

    return errors;
  };

  return (
    <>
      <Form
        mutators={{
          ...arrayMutators,
        }}
        getFieldSchema={getFieldSchema}
        getFieldType={getFieldType}
        names={names}
        onSubmit={onSubmit}
      >
        {({
          handleSubmit,
          submitting,
          renderField,
        }): ReactNode => (
          <form onSubmit={handleSubmit}>
            {renderField('users')}

            <hr />

            <button
              type="submit"
              disabled={submitting}
            >
              Submit
            </button>
          </form>
        )}
      </Form>

      {
        submittedValues && (
          <>
            <hr />

            <h3>
              Submitted values:
            </h3>

            <pre>
              {JSON.stringify(submittedValues, null, 2)}
            </pre>
          </>
        )
      }
    </>
  );
}
