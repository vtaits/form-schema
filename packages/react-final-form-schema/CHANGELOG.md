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
