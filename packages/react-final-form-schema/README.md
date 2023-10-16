[![NPM](https://img.shields.io/npm/v/@vtaits/react-final-form-schema.svg)](https://www.npmjs.com/package/@vtaits/react-final-form-schema)
[![dependencies status](https://david-dm.org/vtaits/form-schema/status.svg?path=packages/react-final-form-schema)](https://david-dm.org/vtaits/form-schema?path=packages/react-final-form-schema)
[![devDependencies status](https://david-dm.org/vtaits/form-schema/dev-status.svg?path=packages/react-final-form-schema)](https://david-dm.org/vtaits/form-schema?path=packages/react-final-form-schema&type=dev)
[![Types](https://img.shields.io/npm/types/@vtaits/react-final-form-schema.svg)](https://www.npmjs.com/package/@vtaits/react-final-form-schema)

# @vtaits/react-final-form-schema

Integration of [react-final-form](https://github.com/final-form/react-final-form) and [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema).

## Installation

```bash
yarn add final-form react-final-form @vtaits/react-final-form-schema
```

or

```bash
npm install final-form react-final-form @vtaits/react-final-form-schema --save
```

## Examples

- [All features](https://codesandbox.io/s/meddo)
- [Dynamic fields](https://codesandbox.io/s/msif8)

## Usage

```tsx
import { Form } from '@vtaits/react-final-form-schema';

<Form
  onSubmit={(values, rawValues) => {
    // submit logic
  }}
  getFieldSchema={getFieldSchema}
  getFieldType={getFieldType}
  names={names}
  mapErrors={(rawErrors, values, rawValues) => {
    // map errors berore process with mapFieldErrors
  }}
  {...reactFinalFormProps}
>
  {
    (reactFinalFormRenderProps) => {
      // render logic, e.g.

      return (
        <>
          <FormField name="field1" />
          <FormField name="field2" />

          <hr />

          <FormField name="field3" payload="payload" />
        </>
      );
    }
  }
</Form>
```

It similar to `react-final-form` but there is some differences:

- `getFieldSchema`, `getFieldType`, `names` are required. They are described in [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema);

- `onSubmit` receives serialized values as first argument;

- `mapErrors` (not required) can map submission errors of form to format of `final-form`;

- `initialValuesPlaceholder` - new prop, initial runtime values of form during asynchronous initialization.

### FormField

A component for rendering field by name according to its schema

#### Props

- `name` - required, string, name of field for render;
- `payload` - not required, payload prop of nested field;
- `parents` - not required, stack of parent fields for child field.

### Type declaration

Type declaration is similar with [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema) but there is new prop:

- `component` - react component that will be rendered with `FormField`. Receives next props:

  - `name` - string, name of field;

  - `fieldSchema` - any, result of `getFieldSchema` by name of field;

  - `payload` - any, prop of `FormField`, can be helpful for arrays of repeating fields;

  - `getFieldSchema` - see [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema);

  - `getFieldType` - see [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema);

  - `parents` - prop of `FormField`, stack of parent fields above current field with runtime values.

## Built-in field types

### Dynamic

Field depends from other fields. Example:

```tsx
import { dynamic } from '@vtaits/react-final-form-schema/fields/dynamic';

const schema = {
  type: 'dynamic',

  getSchema: ({
    otherField,
  }, phase) => ({
    type: 'string',
    label: 'String field',
    required: Boolean(otherField),
  }),
};

const getFieldType = (fieldSchema) => {
  if (fieldSchema.type === 'dynamic') {
    return dynamic;
  }

  // ...
}
```

Parameters:

- `getSchema` - required, function, should return schema for render or `null`. Arguments:

  1. `values` - object of values of form, depends from 2nd argument;

  2. `phase` - current phase (`'parse'`, `'serialize'`, `'render'`). If phase is `'parse'`, 1st argument is initial values before parsing, otherwise it is current values of form.

  3. `getFieldSchema` - see [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema);

  4. `getFieldType` - see [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema);

  5. `parents` - stack of parent fields above current field with runtime values;

- `getSchemaAsync` - not required, function. Can be used for asynchronous parsing. Similar to `getSchema` but should return `Promise` with result schema;

- `onShow` - not required, callback that called when field has shown. Arguments:

  1. `form` - instance of `final-form`;

  2. `name` - name of field;

  3. `schema` - result schema of subfield;

  4. `getFieldSchema` - current `getFieldSchema`;

  5. `getFieldType` - global `getFieldType`;

  6. `parents` - stack of parent fields above current field with runtime values;

- `onHide` - not required, callback that called when field has hidden. Arguments:

  1. `form` - instance of `final-form`;

  2. `name` - name of field;

  3. `getFieldSchema` - current `getFieldSchema`;

  4. `getFieldType` - global `getFieldType`;

  5. `parents` - stack of parent fields above current field with runtime values.

## Utils

### checkValuesReady

```typescript
import { useFormState } from 'react-final-form';
import { checkValuesReady } from '@vtaits/react-final-form-schema';

// ...

const {
  values,
} = useFormState();

const isValuesReady: boolean = checkValuesReady(values);
```

If parsing if asynchronous it returns `true` only after end of parsing;

If parsing if synchronous it always returns `true`.

### useValuesReady

```typescript
import { useValuesReady } from '@vtaits/react-final-form-schema';

// ...

const isValuesReady: boolean = useValuesReady();
```

Hook that encapsulates receiving state of form and checking ready state.

### useFormSchemaState

Hook that returns state for wrapper above `react-final-form`. This is object with next values:

- `isValuesReady` - boolean, result of `useValuesReady`.
