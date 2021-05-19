import { storiesOf } from '@storybook/react';

import { Dynamic } from './Dynamic';
import { FieldArray } from './FieldArray';
import { FormError } from './FormError';
import { SerializerAndParser } from './SerializerAndParser';
import { Simple } from './Simple';
import { ValidateBeforeSubmit } from './ValidateBeforeSubmit';

storiesOf('react-final-form-schema', module)
  .add('Simple', () => <Simple />)
  .add('Serializer and parser', () => <SerializerAndParser />)
  .add('Validate before submit', () => <ValidateBeforeSubmit />)
  .add('FieldArray', () => <FieldArray />)
  .add('Form error', () => <FormError />)
  .add('Dynamic fields', () => <Dynamic />);
