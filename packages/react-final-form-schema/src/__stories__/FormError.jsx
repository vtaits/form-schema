import React from 'react';
import { FORM_ERROR } from 'final-form';

import { Form } from '../index';

const getFieldType = () => null;

const getFieldSchema = () => null;

const names = [];

const delay = (ms) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

const mapErrors = (rawErrors) => {
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

const Example = () => {
  const onSubmit = async () => {
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
      }) => (
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
