import type { Locator, Page } from "@playwright/test";
import { getInput } from "./input";
import type { IFieldOptions } from "./types";

export {
	getInput as getDateInput,
	getInputWrapper as getDateInputWrapper,
} from "./input";

export async function setDateInputValue(
	container: Page | Locator,
	options: IFieldOptions,
	value: string,
) {
	const input = getInput(container, options);

	await input.click();
	await input.fill(value);
}
