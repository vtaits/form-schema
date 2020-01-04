import { storiesOf } from '@storybook/react';

import FieldArray from './FieldArray';
import FormError from './FormError';
import SerializerAndParser from './SerializerAndParser';
import Simple from './Simple';

storiesOf('react-final-form-schema')
  .add('Simple', Simple)
  .add('Serializer and parser', SerializerAndParser)
  .add('FieldArray', FieldArray)
  .add('Form error', FormError);
