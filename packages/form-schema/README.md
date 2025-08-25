[![NPM](https://img.shields.io/npm/v/@vtaits/form-schema.svg)](https://www.npmjs.com/package/@vtaits/form-schema)
![dependencies status](https://img.shields.io/librariesio/release/npm/@vtaits/form-schema)

# @vtaits/form-schema

A set of utilities for easy work with form values and errors:

- Serialize form values before submit by schema
- Parse initial values of form by schema
- Map submission errors by schema

## Installation

```bash
yarn add @vtaits/form-schema
```

or

```bash
npm install @vtaits/form-schema --save
```

or

```bash
bun add @vtaits/form-schema
```

## Concept

There are next entities:

- `names` - array of field names, required for serialization and parsing of initial values;

- `getFieldSchema` - function that returns full schema of field by name (it can contain placeholder for input, options for select, label, help text etc.);

- `getFieldType` - function that returns type declaration of field by full schema.

### Type declaration

Type declaration is an object with next params:

- `serializer` - function for serializing form values before submit. E.g. local value of select can be an object `{ value, label }`, but only `value` should be submitted. Parameters:

  * `value` - current value of the field;
  * `values` - all values of form;
  * `name` - name of current field;
  * `fieldSchema` - full schema of current field;
  * `getFieldSchema` - see above;
  * `getFieldType` - see above;
  * `parents` - stack of parent fields above current field with runtime values.

  Should return **OBJECT** of values or `Promise` with object of values (can be `async`). By default returns

  ```
  {
    [name]: values[name],
  }
  ```

- `parser` - function for parsing initial values of form before initialize. Parameters:

  * `value` - current value of the field;
  * `values` - all values of the form;
  * `name` - name of current field;
  * `fieldSchema` - full schema of current field;
  * `getFieldSchema` - see above;
  * `getFieldType` - see above;
  * `parents` - stack of parent fields above current field with raw values.

  Should return **OBJECT** of values or `Promise` with object of values (can be `async`). By default returns

  ```
  {
    [name]: values[name],
  }
  ```

- `validatorBeforeSubmit` - function for collecting validation errors of form before submit. Receives next parameters:

  * `setError` - a function for setting errors;
  * `value` - current value of the field;
  * `values` - all values of the form;
  * `name` - name of current field;
  * `fieldSchema` - full schema of current field;
  * `getFieldSchema` - see above;
  * `getFieldType` - see above;
  * `parents` - stack of parent fields above current field with runtime values.

  Example:

  ```tsx
  {
    validateBeforeSubmit: ({
      setError,
      values,
      name,
      fieldSchema: { required },
      parents,
    }) => {
      if (required && !values[name]) {
        setError(name, parents, 'This field is required');
      }
    },
  }
  ```

- `errorsSetter` - function for mapping errors of field from backend format to format of field. Receives next parameters:

  * `setError` - a function for setting errors;
  * `setCurrentError` - a function to set error on the current field;
  * `errors` - errors object;
  * `name` - name of current field;
  * `fieldSchema` - full schema of current field;
  * `getFieldSchema` - see above;
  * `getFieldType` - see above;
  * `values` - serialized values of form using `serializer` functions of field;
  * `value` - current serialized value of the field;
  * `rawValues` - all values of form without processing;
  * `rawValue` - current value without processing of the field;
  * `parents` - stack of parent fields above current field with runtime values.

  Should return **OBJECT** of values. By default returns

  ```
  {
    [name]: errors[name],
  }
  ```

- `valueSetter` - function for setting current runtime values. Receives next parameters:

  * `setValue` - a function to set value of the current field;
  * `name` - name of current field;
  * `fieldSchema` - full schema of current field;
  * `getFieldSchema` - see above;
  * `getFieldType` - see above;
  * `value` - current value of the field;
  * `values` - all values of the form;
  * `parents` - stack of parent fields above current field with runtime values.

- `createGetFieldSchema` - function for create `getFieldSchema` for nested fields. Can be helpful for arrays of repeating fields etc. Parameters:

  * `fieldSchema` - schema of current field;
  * `getFieldSchema` - default `getFieldSchema`;
  * `getFieldType` - see above;
  * `values` - current values (values of form during render and serialization or raw values during parsing);
  * `phase` - one of next values: `'parse'`, `'serialize'`, `'render'`;
  * `parents` - stack of parent fields above current field, raw values for phase 'parse' and runtime values otherwise.

## Usage

### Serialization

```tsx
import { serialize } from '@vtaits/form-schema';

// ...

serialize({
	values,
	names,
	getFieldSchema,
	getFieldType,
	parents,
});
```

### Parsing

```tsx
import { parse } from '@vtaits/form-schema';

// ...

parse({
	values,
	names,
	getFieldSchema,
	getFieldType,
	parents,
});
```

### Validation before submit

```tsx
import { validateBeforeSubmit } from '@vtaits/form-schema';

// ...

validateBeforeSubmit({
	setError,
	values,
	names,
	getFieldSchema,
	getFieldType,
	parents,
});
```

### Mapping of errors of fields

```tsx
import { setFieldErrors } from '@vtaits/form-schema';

// ...

setFieldErrors({
	setError,
	errors,
	names,
	getFieldSchema,
	getFieldType,
	values,
	rawValues,
	parents,
});
```

- `values` - serialied values of form (result of `serialize`);
- `rawValues` - raw values of form (before `serialize`).
