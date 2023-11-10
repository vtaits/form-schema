import type {
  ReactElement,
} from 'react';
import type {
  GetFieldSchema,
} from '@vtaits/form-schema';
import { type GetFieldType, type MapErrors, useFormSchema } from '@vtaits/react-hook-form-schema';

const getFieldType: GetFieldType<unknown> = () => ({
  render: () => null,
});

const getFieldSchema: GetFieldSchema<unknown> = () => null;

const delay = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

export function FormError(): ReactElement {
  const onSubmit = async (): Promise<Record<string, any>> => {
    await delay(1000);

    return {
      formError: 'Error',
    };
  };

  const {
    formState: {
      errors,
      isSubmitting,
    },
    handleSubmit,
  } = useFormSchema({
    getFieldSchema,
    getFieldType,
    names: [],
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {
        errors.formError && (
          <p
            style={{
              color: 'red',
            }}
          >
            {errors.formError.message}
          </p>
        )
      }

      <button
        type="submit"
        disabled={isSubmitting}
      >
        Submit
      </button>
    </form>
  );
}
