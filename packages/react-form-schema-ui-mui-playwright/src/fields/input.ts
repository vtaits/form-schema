import { type Locator, type Page, expect } from "@playwright/test";
import { waitForClosePopper, waitForOpenPopper } from "./autocompletePopper";
import type { IFieldOptions } from "./types";

export function getInput(
	container: Page | Locator,
	{ label, name, exact }: IFieldOptions,
) {
	if (label) {
		const inputLabel = container.getByText(label, {
			exact,
		});

		const input = inputLabel.locator("..").getByRole("textbox");

		if (name) {
			return input.filter({
				has: name ? container.locator(`input[name="${name}"]`) : undefined,
			});
		}

		return input;
	}

	return container.locator(`input[name="${name}"]`);
}

export function getInputWrapper(
	container: Page | Locator,
	options: IFieldOptions,
) {
	return getInput(container, options).locator("..").locator("..");
}

export async function setInputValue(
	page: Page,
	container: Page | Locator,
	options: IFieldOptions,
	value: string,
) {
	const input = getInput(container, options);

	await input.fill(value);

	await input.blur();

	await waitForClosePopper(page);
}

export async function checkInputSuggestions(
	page: Page,
	container: Page | Locator,
	options: IFieldOptions,
	check: (optionList: Locator) => Promise<void>,
) {
	const input = getInput(container, options);

	await input.focus();

	const popper = await waitForOpenPopper(page);

	const optionList = popper.getByRole("option");

	await check(optionList);

	await input.blur();

	await waitForClosePopper(page);
}

export async function selectInputSuggestion(
	page: Page,
	container: Page | Locator,
	options: IFieldOptions,
	optionText: string,
) {
	const input = getInput(container, options);

	await input.dispatchEvent("mousedown");

	const popper = await waitForOpenPopper(page);

	const option = popper.getByText(optionText);

	await option.click();

	await expect(input).toHaveValue(optionText);

	await waitForClosePopper(page);
}
