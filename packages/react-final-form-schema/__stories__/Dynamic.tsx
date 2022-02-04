/* eslint-disable @typescript-eslint/no-explicit-any */
import { useField } from 'react-final-form';
import { useState } from 'react';
import type {
  ReactElement,
  ReactNode,
} from 'react';

import type {
  GetFieldSchema,
} from '@vtaits/form-schema';

import { Form } from '@vtaits/react-final-form-schema';
import { dynamic } from '@vtaits/react-final-form-schema/fields/dynamic';
import type {
  GetFieldType,
  FieldType,
} from '@vtaits/react-final-form-schema';

type InputSchema = {
  type: 'input';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

type InputProps = {
  name: string;

  fieldSchema: InputSchema;
};

function InputComponent({
  name,

  fieldSchema: {
    label,
    placeholder,
    disabled,
  },
}: InputProps): ReactElement {
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
          disabled={disabled}
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

const fieldTypes: Record<string, FieldType<any>> = {
  input: {
    component: InputComponent,
  },

  dynamic,
};

const getFieldType: GetFieldType<InputSchema> = ({ type }) => fieldTypes[type];

const fullSchema = {
  firstName: {
    type: 'input',
    label: 'First name',
    placeholder: 'Input your first name',
  },

  lastName: {
    type: 'dynamic',

    getSchema: ({
      firstName,
    }: {
      firstName?: string;
    }) => ({
      type: 'input',
      label: firstName ? `Last name of ${firstName}` : 'INPUT YOUR FIRST NAME FIRST!!!',
      placeholder: 'Input your last name',
      disabled: !firstName,
    }),
  },

  wow: {
    type: 'dynamic',

    getSchema: ({
      lastName,
    }: {
      lastName?: string;
    }) => {
      if (!lastName) {
        return null;
      }

      return {
        type: 'input',
        label: 'WOW',
        placeholder: 'WOW',
      };
    },
  },
};

const getFieldSchema: GetFieldSchema<InputSchema> = (fieldName: string) => fullSchema[fieldName];

const names = ['firstName', 'lastName', 'wow'];

const delay = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

export function Dynamic(): ReactElement {
  const [submittedValues, setSubmittedValues] = useState(null);

  const onSubmit = async (values: Record<string, any>): Promise<Record<string, any>> => {
    setSubmittedValues(null);

    await delay(1000);

    setSubmittedValues(values);
    return null;
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
            {renderField('wow')}

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
