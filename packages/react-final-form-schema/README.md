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


## Usage

```javascript
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
    ({
      renderField,
      ...reactFinalFormRenderProps
    }) => {
      // render logic, e.g.

      return (
        <>
          {renderField('field1')}
          {renderField('field2')}

          <hr />

          {renderField('field3', 'payload')}
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

- new render prop `renderField` can optimize boilerplate of imports.

### Type declaration

Type declaration is similar with [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema) but there is new prop:

- `component` - react component that will be rendered with `renderField`. Receives next props:

  - `name` - string, name of field;

  - `fieldSchema` - any, result of `getFieldSchema` by name of field;

  - `payload` - any, 2nd argument of `renderField`, can be helpful for arrays of repeating fields;

  - `getFieldSchema` - see [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema);

  - `getFieldType` - see [@vtaits/form-schema](https://github.com/vtaits/form-schema/tree/master/packages/form-schema);

  - `renderField` - function, can be helpful for render nested fields.
