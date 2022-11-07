import type {
  Context,
} from 'react';

import { createContext } from '@vtaits/react-required-context';

import type { FormSchemaContextType } from './types';

export const FormSchemaContext = createContext<FormSchemaContextType<unknown>>() as Context<FormSchemaContextType<unknown>>;
