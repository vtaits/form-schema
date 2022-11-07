import { createContext } from 'react';

import type { FormFieldContextType } from './types';

export const FormFieldContext = createContext<FormFieldContextType<unknown> | null>(null);
