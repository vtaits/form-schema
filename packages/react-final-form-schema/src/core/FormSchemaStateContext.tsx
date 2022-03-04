import { createContext } from 'react';

import type {
  FormSchemaStateContextType,
} from './types';

export const FormSchemaStateContext = createContext<FormSchemaStateContextType | null>(null);
