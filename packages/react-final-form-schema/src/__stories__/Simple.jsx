import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useField } from 'react-final-form';

import { Form } from '../index';

const InputComponent = ({
  fieldUniq,

  fieldSchema: {
    label,
    placeholder,
  },
}) => {
  const {
    input: {
      value,
      onChange,
    },

    meta: {
      dirtySinceLastSubmit,
      submitError,
    },
  } = useField(fieldUniq);

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
          name={fieldUniq}
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
};

const fieldTypes = {
  input: {
    component: InputComponent,
  },
};

const getFieldType = ({ type }) => fieldTypes[type];

const fullSchema = {
  firstName: {
    type: 'input',
    label: 'First name',
    placeholder: 'Input your first name',
  },

  lastName: {
    type: 'input',
    label: 'Last name',
    placeholder: 'Input your last name',
  },
};

const getFieldSchema = (fieldName) => fullSchema[fieldName];

const schema = ['firstName', 'lastName'];

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

    if (!values.firstName) {
      errors.firstName = ['This field is required'];
    }

    if (!values.lastName) {
      errors.lastName = ['This field is required'];
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
            {renderField('firstName')}
            {renderField('lastName')}

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
