/* eslint-disable @typescript-eslint/no-explicit-any */
import { FORM_ERROR } from 'final-form';
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
} from '../index';

type Values = Record<string, any>;
type Errors = Record<string, any>;

const EmptyComponent: FC = () => <div />;

const getFieldType: GetFieldType<unknown, Values, Values, Values, Errors, unknown> = () => ({
  component: EmptyComponent,
});

const getFieldSchema: GetFieldSchema<unknown> = () => null;

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
