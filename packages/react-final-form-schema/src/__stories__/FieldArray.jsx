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
  name: PropTypes.string.isRequired,

  fieldSchema: PropTypes.shape({
    label: PropTypes.string,
    initialValues: PropTypes.object,

    names: PropTypes.array.isRequired,
  }).isRequired,

  renderField: PropTypes.func.isRequired,
};

const InputComponent = ({
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

InputComponent.propTypes = {
  name: PropTypes.string.isRequired,

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
      const getChildFieldSchema = (name) => fields[name];

      return getChildFieldSchema;
    },

    serializer: (values, name, { names }, getFieldSchema, getFieldType) => {
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

    valueParser: (values, name, { names }, getFieldSchema, getFieldType) => {
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

    errorsMapper: (errors, name, { names }, getFieldSchema, getFieldType) => {
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

    names: ['firstName', 'lastName'],
  },
};

const getFieldSchema = (fieldName) => fullSchema[fieldName];

const names = ['users'];

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
        names={names}
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
