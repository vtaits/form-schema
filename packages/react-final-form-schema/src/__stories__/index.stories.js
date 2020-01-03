import { storiesOf } from '@storybook/react';

import Simple from './Simple';
import SerializerAndParser from './SerializerAndParser';

storiesOf('react-final-form-schema')
  .add('Simple', Simple)
  .add('Serializer and parser', SerializerAndParser);
