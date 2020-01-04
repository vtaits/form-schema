import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { useField } from 'react-final-form';

import { Form } from '../index';

const SelectComponent = ({
  name,

  fieldSchema: {
    label,
    options,
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

      <Select
        isClearable
        name={name}
        value={value || null}
        options={options}
        onChange={onChange}
      />

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

SelectComponent.propTypes = {
  name: PropTypes.string.isRequired,

  fieldSchema: PropTypes.shape({
    label: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
};

const fieldTypes = {
  select: {
    component: SelectComponent,

    serializer: (values, name) => {
      const value = values[name];

      return {
        [name]: value ? value.value : null,
      };
    },

    parser: (values, name, { options }) => {
      const value = values[name];

      return {
        [name]: value
          ? options.find((option) => {
            if (option.value === value) {
              return true;
            }

            return false;
          })
          : null,
      };
    },
  },
};

const getFieldType = ({ type }) => fieldTypes[type];

const fullSchema = {
  animal: {
    type: 'select',
    label: 'Animal',

    options: [
      {
        value: 1,
        label: 'Cat',
      },

      {
        value: 2,
        label: 'Dog',
      },

      {
        value: 3,
        label: 'Elephant',
      },

      {
        value: 4,
        label: 'Cow',
      },
    ],
  },
};

const getFieldSchema = (fieldName) => fullSchema[fieldName];

const names = ['animal'];

const delay = (ms) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

const initialValues = {
  animal: 2,
};

const Example = () => {
  const [submittedValues, setSubmittedValues] = useState(null);

  const onSubmit = async (values) => {
    await delay(1000);

    setSubmittedValues(values);
  };

  return (
    <>
      <Form
        initialValues={initialValues}
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
            {renderField('animal')}

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
