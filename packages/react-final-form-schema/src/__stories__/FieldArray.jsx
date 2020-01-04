import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import {
  serialize,
  parse,
  mapFieldErrors,
} from '@vtaits/form-schema';

import { ARRAY_ERROR } from 'final-form';
import { useField } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useFieldArray } from 'react-final-form-arrays';

import { Form } from '../index';

const ArrayComponent = ({
  fieldUniq,

  fieldSchema: {
    label,
    schema,
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
  } = useFieldArray(fieldUniq);

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
        fields.map((name, index) => (
          <div
            key={name}
          >
            {
              schema.map((fieldName) => (
                <Fragment
                  key={fieldName}
                >
                  {renderField(fieldName, name)}
                </Fragment>
              ))
            }

            <button
              type="button"
              onClick={() => fields.remove(index)}
            >
              Remove
            </button>

            <hr />
          </div>
        ))
      }

      <button
        type="button"
        onClick={() => fields.push(initialValues || {})}
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

ArrayComponent.propTypes = {
  fieldUniq: PropTypes.string.isRequired,

  fieldSchema: PropTypes.shape({
    label: PropTypes.string,
    initialValues: PropTypes.object,

    schema: PropTypes.array.isRequired,
  }).isRequired,

  renderField: PropTypes.func.isRequired,
};

const InputComponent = ({
  fieldUniq,

  fieldSchema: {
    label,
    placeholder,
  },

  payload,
}) => {
  const name = payload
    ? `${payload}.${fieldUniq}`
    : fieldUniq;

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

InputComponent.propTypes = {
  fieldUniq: PropTypes.string.isRequired,

  fieldSchema: PropTypes.shape({
    label: PropTypes.string,
    placeholder: PropTypes.string,
  }).isRequired,

  payload: PropTypes.string,
};

InputComponent.defaultProps = {
  payload: null,
};

const fieldTypes = {
  array: {
    component: ArrayComponent,

    createGetFieldSchema: ({ fields }) => {
      const getChildFieldSchema = (fieldUniq) => fields[fieldUniq];

      return getChildFieldSchema;
    },

    serializer: (values, fieldUniq, { schema }, getFieldSchema, getFieldType) => {
      const arrayValues = values[fieldUniq];

      if (!arrayValues) {
        return {
          [fieldUniq]: [],
        };
      }

      return {
        [fieldUniq]: arrayValues.map(
          (arrayValue) => serialize(
            arrayValue || {},
            schema,
            getFieldSchema,
            getFieldType,
          ),
        ),
      };
    },

    valueParser: (values, fieldUniq, { schema }, getFieldSchema, getFieldType) => {
      const arrayValues = values[fieldUniq];

      if (!arrayValues || arrayValues.length === 0) {
        return {
          [fieldUniq]: [parse({}, schema, getFieldSchema, getFieldType)],
        };
      }

      return {
        [fieldUniq]: arrayValues.map(
          (arrayValue) => parse(
            arrayValue || {},
            schema,
            getFieldSchema,
            getFieldType,
          ),
        ),
      };
    },

    errorsMapper: (errors, fieldUniq, { schema }, getFieldSchema, getFieldType) => {
      const arrayErrors = errors[fieldUniq];

      if (!arrayErrors) {
        return {};
      }

      if (arrayErrors instanceof Array && typeof arrayErrors[0] === 'string') {
        return {
          [fieldUniq]: {
            [ARRAY_ERROR]: arrayErrors,
          },
        };
      }

      return {
        [fieldUniq]: arrayErrors.map(
          (arrayError) => mapFieldErrors(
            arrayError || {},
            schema,
            getFieldSchema,
            getFieldType,
          ),
        ),
      };
    },
  },

  input: {
    component: InputComponent,
  },
};

const getFieldType = ({ type }) => fieldTypes[type];

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

    schema: ['firstName', 'lastName'],
  },
};

const getFieldSchema = (fieldName) => fullSchema[fieldName];

const schema = ['users'];

const delay = (ms) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

const Example = () => {
  const [submittedValues, setSubmittedValues] = useState(null);

  const onSubmit = async (values) => {
    setSubmittedValues(null);

    await delay(1000);

    const errors = {};

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
          const errorObj = {};

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
        mutators={arrayMutators}
        getFieldSchema={getFieldSchema}
        getFieldType={getFieldType}
        schema={schema}
        onSubmit={onSubmit}
      >
        {({
          handleSubmit,
          submitting,
          renderField,
        }) => (
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
