import { Locator, Page } from '@playwright/test';
import { IFieldOptions } from './types';
import { getInput } from './input';

export {getInput as getDateInput, getInputWrapper as getDateInputWrapper } from './input';

export async function setDateInputValue(
  container: Page | Locator,
	options: IFieldOptions,
	value: string,
) {
  const input = getInput(container, options);

  await input.click();
  await input.fill(value);
}
