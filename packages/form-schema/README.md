[![NPM](https://img.shields.io/npm/v/@vtaits/form-schema.svg)](https://www.npmjs.com/package/@vtaits/form-schema)
[![dependencies status](https://david-dm.org/vtaits/form-schema/status.svg?path=packages/form-schema)](https://david-dm.org/vtaits/form-schema?path=packages/form-schema)
[![devDependencies status](https://david-dm.org/vtaits/form-schema/dev-status.svg?path=packages/form-schema)](https://david-dm.org/vtaits/form-schema?path=packages/form-schema&type=dev)
[![Types](https://img.shields.io/npm/types/@vtaits/form-schema.svg)](https://www.npmjs.com/package/@vtaits/form-schema)

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

## Concept

There are next entities:

- `names` - array of field names, required for serialization and parsing of initial values;

- `getFieldSchema` - function that returns full schema of field by name (it can contain placeholder for input, options for select, label, help text etc.);

- `getFieldType` - function that returns type declaration of field by full schema.

### Type declaration

Type declaration is an object with next params:

- `serializer` - function for serialize form values before submit. E.g. local value of select can be object `{ value, label }`, but only `value` should be submitted. Receives next arguments:

  1. `values` - all values of form;
  2. `name` - name of current field;
  3. `fieldSchema` - full schema of field;
  4. `getFieldSchema` - see above;
  5. `getFieldType` - see above.

  Should return **OBJECT** of values. By default returns

  ```
  {
    [name]: values[name],
  }
  ```

- `parser` - function for parse initial values of form before initialize. Receives next arguments:

  1. `values` - all values of form;
  2. `name` - name of current field;
  3. `fieldSchema` - full schema of field;
  4. `getFieldSchema` - see above;
  5. `getFieldType` - see above.

  Should return **OBJECT** of values. By default returns

  ```
  {
    [name]: values[name],
  }
  ```

- `errorsMapper` - function for map errors of field from backend format to format of field. Receives next arguments:

  1. `errors` - intermediate result (default errors of form and collected erros of other fields);
  2. `name` - name of current field;
  3. `fieldSchema` - full schema of field;
  4. `getFieldSchema` - see above;
  5. `getFieldType` - see above;
  6. `values` - serialized values of form using `serializer` functions of field;
  7. `rawValues` - all values of form without processing.

  Should return **OBJECT** of values. By default returns

  ```
  {
    [name]: errors[name],
  }
  ```

- `createGetFieldSchema` - function for create `getFieldSchema` for nested fields. Can be helpful for arrays of repeating fields etc. Arguments:

  1. `fieldSchema` - schema of current field;
  2. `getFieldSchema` - default `getFieldSchema`;
  3. `getFieldType` - see above;
  4. `values` - current values (values of form during render and serialization or raw values during parsing);
  5. `phase` - one of next values: `'parse'`, `'serialize'`, `'render'`;

## Usage

### Serialization

```javascript
import { serialize } from '@vtaits/form-schema';

...

serialize(values, names, getFieldSchema, getFieldType);
```

### Parsing

```javascript
import { parse } from '@vtaits/form-schema';

...

parse(values, names, getFieldSchema, getFieldType);
```

### Mapping of errors of fields

```javascript
import { mapFieldErrors } from '@vtaits/form-schema';

...

mapFieldErrors(errors, names, getFieldSchema, getFieldType, values, rawValues);
```

- `values` - serialied values of form (result of `serialize`);
- `rawValues` - raw values of form (before `serialize`).
