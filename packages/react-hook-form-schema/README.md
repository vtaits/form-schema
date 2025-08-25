[![NPM](https://img.shields.io/npm/v/@vtaits/react-hook-form-schema.svg)](https://www.npmjs.com/package/@vtaits/react-hook-form-schema)
![dependencies status](https://img.shields.io/librariesio/release/npm/@vtaits/react-hook-form-schema)

# @vtaits/react-hook-form-schema

Integration of [react-hook-form](https://react-hook-form.com/) and [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema).

## Installation

```bash
yarn add react-hook-form @vtaits/react-hook-form-schema
```

or

```bash
npm install react-hook-form @vtaits/react-hook-form-schema --save
```

or

```bash
bun add react-hook-form @vtaits/react-hook-form-schema
```

## Examples

- [All features](https://codesandbox.io/s/ldk9np)
- [Dynamic fields](https://codesandbox.io/s/tz3gct)

## Usage

```tsx
import { useFormSchema } from '@vtaits/react-hook-form-schema';

const {
  handleSubmit,
  renderField,
  setValues,
  parseAndSetValues,
  ...restResult
} = useFormSchema({
		defaultValues,
		getFieldSchema,
		getFieldType,
		mapErrors,
		names,
		...rest
});

const onSubmit = async (values, rawValues) => {
};

<form onSubmit={handleSubmit(onSubmit)}>
  {renderField("field1")}
  {renderField("field2")}

  <hr />

  {renderField("field3", "payload")}
</form>
```

It similar to `react-hook-form` but there is some differences:

- `getFieldSchema`, `getFieldType`, `names` are required. They are described in [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema);

- `onSubmit` receives serialized values as first argument;

- `mapErrors` (not required) can map submission errors to set them with [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema).

### renderField

A function for rendering field by name according to its schema. Arguments:

1. `name` - required, string, name of field for render;
2. `payload` - not required, payload prop of nested field;
3. `parents` - not required, stack of parent fields for child field.

### setValues

A function for setting runtime values of the form

### parseAndSetValues

A function that parses input and sets runtime values of the form

## Built-in field types

### Dynamic

Field depends from other fields. Example:

```tsx
import { dynamic } from '@vtaits/react-hook-form-schema/fields/dynamic';

const schema = {
  type: 'dynamic',

  getSchema: ({
    values: {
      otherField,
    },
    phase,
  }) => ({
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

- `getSchema` - required, function, should return schema for render or `null`. Parameters:

  - `values` - object of values of form, depends from 2nd argument;

  - `phase` - current phase (`'parse'`, `'serialize'`, `'render'`). If phase is `'parse'`, 1st argument is initial values before parsing, otherwise it is current values of form.

  - `getFieldSchema` - see [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema);

  - `getFieldType` - see [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema);

  - `parents` - stack of parent fields above current field with runtime values;

- `getSchemaAsync` - not required, function. Can be used for asynchronous parsing. Similar to `getSchema` but should return `Promise` with result schema;

- `onShow` - not required, callback that called when field has shown. Parameters:

  - `formResult` - result of calling of `react-hook-form`;

  - `name` - name of field;

  - `schema` - result schema of subfield;

  - `getFieldSchema` - current `getFieldSchema`;

  - `getFieldType` - global `getFieldType`;

  - `parents` - stack of parent fields above current field with runtime values;

- `onHide` - not required, callback that called when field has hidden. Arguments:

  1. `formResult` - result of calling of `react-hook-form`;

  2. `name` - name of field;

  3. `getFieldSchema` - current `getFieldSchema`;

  4. `getFieldType` - global `getFieldType`;

  5. `parents` - stack of parent fields above current field with runtime values.

### Set

The group of fields. It's comfortable when the `dynamic` field must render several fields. Example:

```tsx
import { dynamic } from '@vtaits/react-hook-form-schema/fields/dynamic';
import { set } from '@vtaits/react-hook-form-schema/fields/set';

const schema = {
  type: 'dynamic',

  getSchema: ({
    responsibleType,
  }) => {
    if (responsibleType !== 'human') {
      return null;
    }

    return {
      type: 'set',
      schemas: {
        firstName: {
          type: 'string',
          label: 'First name',
        },

        lastName: {
          type: 'string',
          label: 'Last name',
        },
      },
    };
  },
};

const getFieldType = (fieldSchema) => {
  if (fieldSchema.type === 'dynamic') {
    return dynamic;
  }

  if (fieldSchema.type === 'set') {
    return set;
  }

  // ...
}
```

Parameters:

- `schemas` - required, object whose keys are field names and values are their schemas;

- `render` - not required, render function. . Arguments:

  1. `renderField` - analogous to `renderField` result of `useFormSchema`;
  2. `names` - fields names (keys of schemas);

## Utils

### renderBySchema

Similar to `renderField` of the result of `useFormSchema`, but have more arguments:

1. `formResult` - result of `react-hook-form`;
2. `getFieldSchema` - see above;
3. `getFieldType` - see above;
4. `getValues` - all values at the level of field;
5. `name` - the name of the field
6. `payload` - see above
7. `parents` - see above.

```typescript
import { renderBySchema } from '@vtaits/react-final-form-schema';
```
