## 3.0.0

### New features

- Added `serializerSingle` property for field types
- Added `parserSingle` property for field types
- Added `setCurrentError` argument to validate functions
- Added `serializeSingle` helper
- Added `parseSingle` helper
- Added `value` property for field methods
- Added built-in parameters to schemas of fields: `serializer`, `serializerSingle`, `parser`, `parserSingle`, `validatorBeforeSubmit`

### Breaking changes

- Make all the helpers asynchronous
- Changed parameters of `getSchema` of `dynamic` field

## 2.2.0 (27 nov 2023)

### New features

- Added property `nested` to field `set`

## 2.1.0 (26 nov 2023)

### New features

- Added built-in field `set`

## 2.0.0 (16 nov 2023)

### Breaking changes

- Remove `mapFieldErrors` in favor of `setFieldErrors`
- `validateBeforeSubmit` takes `setError` argument and returns nothing
- Use objects of parameters instead of long lists of arguments

## 1.0.0 (16 oct 2023)

### New features

- Added `parents` argument to helpers

## 0.3.0-alpha.1 (22 mar 2023)

### Improvement

- Migrate to `tsup`

## 0.3.0-alpha.0 (06 apr 2022)

### New features

- Added `parents` argument to helpers

## 0.2.5 (10 feb 2022)

### New features

- Allow asynchronous parsers
- `parse` returns `Promise` if one of parsers is asynchronous

## 0.2.4 (19 may 2021)

### New features

- Export next utils:

  - `defaultSerializer`
  - `defaultParser`
  - `defaultFieldErrorsMapper`

### Improvement

- Use default values in generics

## 0.2.3 (17 may 2021)

### New features

- Added `validatorBeforeSubmit` property for field types
- Added `validateBeforeSubmit` helper

## 0.2.2 (10 dec 2020)

### New features

- Added `getFieldType` argument to `createGetFieldSchema`

## 0.2.1 (10 dec 2020)

### New features

- Export type `PhaseType`

## 0.2.0 (03 dec 2020)

### New features

- Added new arguments to `createGetFieldSchema`: `values`, `phase`

### Breaking changes

- Make `typescript` typings more strict
