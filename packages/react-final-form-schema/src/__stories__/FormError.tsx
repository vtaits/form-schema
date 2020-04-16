import React from 'react';
import type {
  FC,
  ReactNode,
} from 'react';
import { FORM_ERROR } from 'final-form';
import type {
  GetFieldSchema,
  Errors,
} from '@vtaits/form-schema';

import { Form } from '../index';
import type {
  GetFieldType,
} from '../index';

const EmptyComponent: FC = () => <div />;

const getFieldType: GetFieldType = () => ({
  component: EmptyComponent,
});

const getFieldSchema: GetFieldSchema = () => null;

const names = [];

const delay = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

const mapErrors = (rawErrors: Errors): Errors => {
  if (rawErrors.formError) {
    const {
      formError,
      ...rest
    } = rawErrors;

    return {
      ...rest,
      [FORM_ERROR]: formError,
    };
  }

  return rawErrors;
};

const Example: FC = () => {
  const onSubmit = async (): Promise<Errors> => {
    await delay(1000);

    return {
      formError: 'Error',
    };
  };

  return (
    <Form
      mapErrors={mapErrors}
      getFieldSchema={getFieldSchema}
      getFieldType={getFieldType}
      names={names}
      onSubmit={onSubmit}
    >
      {({
        handleSubmit,
        submitting,
        submitError,
      }): ReactNode => (
        <form onSubmit={handleSubmit}>
          {
            submitError && (
              <p
                style={{
                  color: 'red',
                }}
              >
                {submitError}
              </p>
            )
          }

          <button
            type="submit"
            disabled={submitting}
          >
            Submit
          </button>
        </form>
      )}
    </Form>
  );
};

export default Example;
