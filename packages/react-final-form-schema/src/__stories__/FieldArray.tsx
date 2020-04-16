/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import React, { Fragment, useState } from 'react';
import type {
  FC,
  ReactNode,
} from 'react';

import {
  serialize,
  parse,
  mapFieldErrors,
} from '@vtaits/form-schema';
import type {
  GetFieldSchema,
  Errors,
  Values,
} from '@vtaits/form-schema';

import { ARRAY_ERROR } from 'final-form';
import { useField } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useFieldArray } from 'react-final-form-arrays';

import { Form } from '../index';
import type {
  RenderField,
  FieldType,
  GetFieldType,
} from '../index';

type ArrayProps = {
  name: string;

  fieldSchema: {
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialValues?: Record<string, any>;
    names: string[];
  };

  renderField: RenderField;
};

const ArrayComponent: FC<ArrayProps> = ({
  name,

  fieldSchema: {
    label,
    names,
    initialValues,
  },

  renderField,
}) => {
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
        fields.map((namePrefix, index) => (
          <div
            key={namePrefix}
          >
            {
              names.map((fieldName) => (
                <Fragment
                  key={fieldName}
                >
                  {renderField(fieldName, namePrefix)}
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
        ))
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
};

type InputProps = {
  name: string;

  fieldSchema: {
    label?: string;
    placeholder?: string;
  };

  payload?: string;
};

const InputComponent: FC<InputProps> = ({
  name: nameProp,

  fieldSchema: {
    label,
    placeholder,
  },

  payload,
}) => {
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
};

InputComponent.defaultProps = {
  payload: null,
};

const fieldTypes: Record<string, FieldType> = {
  array: {
    component: ArrayComponent,

    createGetFieldSchema: ({ fields }: { fields: Record<string, any>}): GetFieldSchema => {
      const getChildFieldSchema: GetFieldSchema = (name: string) => fields[name];

      return getChildFieldSchema;
    },

    serializer: (
      values: Values,
      name: string,
      { names }: { names: string[] },
      getFieldSchema: GetFieldSchema,
      getFieldType: GetFieldType,
    ): Values => {
      const arrayValues = values[name];

      if (!arrayValues) {
        return {
          [name]: [],
        };
      }

      return {
        [name]: arrayValues.map(
          (arrayValue) => serialize(
            arrayValue || {},
            names,
            getFieldSchema,
            getFieldType,
          ),
        ),
      };
    },

    parser: (
      values: Values,
      name: string,
      { names }: { names: string[] },
      getFieldSchema: GetFieldSchema,
      getFieldType: GetFieldType,
    ): Values => {
      const arrayValues = values[name];

      if (!arrayValues || arrayValues.length === 0) {
        return {
          [name]: [parse({}, names, getFieldSchema, getFieldType)],
        };
      }

      return {
        [name]: arrayValues.map(
          (arrayValue) => parse(
            arrayValue || {},
            names,
            getFieldSchema,
            getFieldType,
          ),
        ),
      };
    },

    errorsMapper: (
      errors: Errors,
      name: string,
      { names }: { names: string[] },
      getFieldSchema: GetFieldSchema,
      getFieldType: GetFieldType,
      values: Values,
      rawValues: Values,
    ): Errors => {
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
        [name]: arrayErrors.map(
          (arrayError) => mapFieldErrors(
            arrayError || {},
            names,
            getFieldSchema,
            getFieldType,
            values,
            rawValues,
          ),
        ),
      };
    },
  },

  input: {
    component: InputComponent,
  },
};

const getFieldType: GetFieldType = ({ type }: { type: string }) => fieldTypes[type];

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

const getFieldSchema: GetFieldSchema = (fieldName: string) => fullSchema[fieldName];

const names: string[] = ['users'];

const delay = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

const Example: FC = () => {
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
};

export default Example;
