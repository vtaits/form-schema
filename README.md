[![devDependencies status](https://david-dm.org/vtaits/form-schema/dev-status.svg)](https://david-dm.org/vtaits/form-schema?type=dev)

A set of utilities for easy work with form values and errors.

- [Core package](https://github.com/vtaits/form-schema/tree/master/packages/form-schema)

- [Integration with react-hook-form](https://github.com/vtaits/form-schema/tree/master/packages/react-hook-form-schema)

- [Integration with react-final-form](https://github.com/vtaits/form-schema/tree/final-form/packages/react-final-form-schema)

## Local development

Repository is using [bun](https://bun.sh/)

### Local development

- `bun run build` - build all the packages

- `bun run lint:fix` - autofix linter errors

- `bun run start` - start storybook in dev mode

- `start:storybook:e2e` - start storybook for e2e testing

- `make build_e2e` - build docker container for e2e testing

- `make test_e2e` - run all the e2e tests

- `make dev_e2e` - run playwright in dev mode

- `bun run test` - run all the code validators and tests
