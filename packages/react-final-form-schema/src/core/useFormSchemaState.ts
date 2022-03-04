import { useContext } from 'react';

import { FormSchemaStateContext } from './FormSchemaStateContext';

export const useFormSchemaState = () => {
  const formSchemaContext = useContext(FormSchemaStateContext);

  if (!formSchemaContext) {
    throw new Error('[useFormSchemaState] can be used only inside `Form`');
  }

  return formSchemaContext;
};
