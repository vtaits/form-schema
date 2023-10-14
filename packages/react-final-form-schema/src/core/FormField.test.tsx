import { expect, test, vi } from 'vitest';
import { type ReactElement, useDebugValue, useMemo, useContext } from 'react';
import { create } from 'react-test-engine';
import {
  useForm,
  useFormState,
} from 'react-final-form';
import type { FormApi, FormState } from 'final-form';
import {
  useContext as useRequiredContext,
} from '@vtaits/react-required-context';

import { FormField } from './FormField';
import { FormFieldContext } from './FormFieldContext';
import type { FieldComponentProps } from './types';

vi.mock('react', async () => {
  const actual = await vi.importActual('react') as Record<string, unknown>;

  return {
    ...actual,
    useContext: vi.fn(),
    useMemo: vi.fn(),
  };
});
vi.mock('react-final-form');
vi.mock('@vtaits/react-required-context');

function TestComponent(props: FieldComponentProps<any, any, any, any, any, any>): ReactElement {
  useDebugValue(props);

  return <div />;
}

const form = {
  TYPE: "FORM",
} as unknown as FormApi;

const render = create(FormField, {
  name: 'testName',
}, {
  queries: {
    field: {
      component: TestComponent,
    },

    formFieldContext: {
      component: FormFieldContext.Provider,
    },
  },

  hooks: {
    useForm,
    useFormState,
    parents: useMemo,
    formSchemaContext: useRequiredContext,
    parentFieldContext: useContext,
    fieldSchema: useMemo,
    fieldType: useMemo,
    getChildFieldSchema: useMemo,
    fieldContextValue: useMemo,
  },

  hookOrder: [
    'useForm',
    'useFormState',
    'parents',
    'formSchemaContext',
    'parentFieldContext',
    'fieldSchema',
    'fieldType',
    'getChildFieldSchema',
    'fieldContextValue',
  ],

  hookDefaultValues: {
    useForm: form,
    useFormState: {
      values: {},
    } as FormState<Record<string, any>>,
    parents: [],
    formSchemaContext: {
      getFieldSchema: vi.fn(),
      getFieldType: vi.fn(),
    },
  },

  mockFunctionValue: (hook, value) => {
    vi.mocked(hook).mockReturnValueOnce(value);
  },

  getMockArguments: (hook, callIndex) => {
    return vi.mocked(hook).mock.calls[callIndex];
  },
});
