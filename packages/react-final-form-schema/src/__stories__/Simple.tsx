/* eslint-disable @typescript-eslint/no-explicit-any */
import { useField } from 'react-final-form';
import { useState } from 'react';
import type {
  FC,
  ReactNode,
} from 'react';

import type {
  GetFieldSchema,
} from '@vtaits/form-schema';

import { Form } from '../index';
import type {
  GetFieldType,
  FieldType,
} from '../index';

type InputSchema = {
  type: 'input';
  label?: string;
  placeholder?: string;
};

type InputProps = {
  name: string;

  fieldSchema: InputSchema;
};

const InputComponent: FC<InputProps> = ({
  name,

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

type Values = Record<string, any>;
type Errors = Record<string, any>;

const fieldTypes: Record<string, FieldType<
InputSchema,
Values,
Values,
Values,
Errors,
unknown
>> = {
  input: {
    component: InputComponent,
  },
};

const getFieldType: GetFieldType<
InputSchema,
Values,
Values,
Values,
Errors,
unknown
> = ({ type }) => fieldTypes[type];

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

const getFieldSchema: GetFieldSchema<InputSchema> = (fieldName: string) => fullSchema[fieldName];

const names = ['firstName', 'lastName'];

const delay = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

export const Simple: FC = () => {
  const [submittedValues, setSubmittedValues] = useState(null);

  const onSubmit = async (values: Values): Promise<Errors> => {
    setSubmittedValues(null);

    await delay(1000);

    const errors: Errors = {};

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
        names={names}
        onSubmit={onSubmit}
      >
        {({
          handleSubmit,
          submitting,
          renderField,
        }): ReactNode => (
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
