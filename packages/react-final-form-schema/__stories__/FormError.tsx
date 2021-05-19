/* eslint-disable @typescript-eslint/no-explicit-any */
import { FORM_ERROR } from 'final-form';
import type {
  FC,
  ReactNode,
} from 'react';
import type {
  GetFieldSchema,
} from '@vtaits/form-schema';

import { Form } from '@vtaits/react-final-form-schema';
import type {
  GetFieldType,
  MapErrors,
} from '@vtaits/react-final-form-schema';

const EmptyComponent: FC = () => <div />;

const getFieldType: GetFieldType<unknown> = () => ({
  component: EmptyComponent,
});

const getFieldSchema: GetFieldSchema<unknown> = () => null;

const names = [];

const delay = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

const mapErrors: MapErrors = (rawErrors) => {
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

export const FormError: FC = () => {
  const onSubmit = async (): Promise<Record<string, any>> => {
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
