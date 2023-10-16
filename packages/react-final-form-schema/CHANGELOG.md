## 1.0.0 (16 oct 2023)

### New features

- Export `FormField` component to replace `renderField` function

### Breaking changes

- Replace `renderField` with `FormField`

  Before:

  ```tsx
  <Form
    {...formProps}
  >
    {({
      renderField,
    }) => (
      <form>
        {renderField('name1')}
        {renderField('name2', 'payload')}
        {renderField('name3', 'payload', [
          {
            name: 'parent',
            values: {
              foo: 'bar',
            },
          },
        ])}
      </form>
    )}
  </Form>
  ```

  After:

  ```tsx
  <Form
    {...formProps}
  >
    {({
      renderField,
    }) => (
      <form>
        <FormField
          name="name1"
        />

        <FormField
          name="name2"
          payload="payload"
        />

        <FormField
          name="name3"
          payload="payload"
          parents={[
            {
              name: 'parent',
              values: {
                foo: 'bar',
              },
            },
          ]}
        />
      </form>
    )}
  </Form>
  ```

## 0.3.0-alpha.5 (22 mar 2023)

### Improvement

- Migrate to `tsup`

## 0.3.0-alpha.4 (18 mar 2023)

### Improvement

- Added `exports` field to `package.json`

## 0.3.0-aplha.2 (20 apr 2022)

### New features

- Added `checkValuesReady` util
- Added `useValuesReady` hook

## 0.3.0-alpha.1 (18 apr 2022)

### New features

- Added `initialValuesPlaceholder` prop

## 0.3.0-alpha.0 (06 apr 2022)

### New features

- Support `parents` in components

## 0.2.5 (06 mar 2022)

### New features

- Added `useFormSchemaState` hook
- Support asyncronous parsing in `dynamic` field with `getSchemaAsync` property
- Support `onShow` and `onHide` callbacks in schema of `dynamic` field

## 0.2.4 (10 feb 2022)

### New features

- Allow asynchronous parsers

## 0.2.3 (19 may 2021)

### New features

- Added `dynamic` field

### Improvement

- Use default values in generics

## 0.2.2 (17 may 2021)

### New features

- Support validation before submit

## 0.2.0 (03 dec 2020)

### New features

- Added new arguments to `createGetFieldSchema`: `values`, `phase`

### Internal changes

- Migrate to [new JSX transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)

### Breaking changes

- Make `typescript` typings more strict

- Drop `react` less than `16.14.0`
