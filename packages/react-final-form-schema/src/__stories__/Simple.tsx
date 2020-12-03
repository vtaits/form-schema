import { useState } from 'react';
import type {
  FC,
  ReactNode,
} from 'react';

import { useField } from 'react-final-form';
import type {
  Errors,
  GetFieldSchema,
} from '@vtaits/form-schema';

import { Form } from '../index';
import type {
  GetFieldType,
  FieldType,
} from '../index';

type InputProps = {
  name: string;

  fieldSchema: {
    label?: string;
    placeholder?: string;
  };
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

const fieldTypes: Record<string, FieldType> = {
  input: {
    component: InputComponent,
  },
};

const getFieldType: GetFieldType = ({ type }: { type: string }) => fieldTypes[type];

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

const getFieldSchema: GetFieldSchema = (fieldName: string) => fullSchema[fieldName];

const names = ['firstName', 'lastName'];

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

export default Example;
