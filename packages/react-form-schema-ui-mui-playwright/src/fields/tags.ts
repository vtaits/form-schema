import { type Locator, type Page, expect } from "@playwright/test";
import { waitForClosePopper, waitForOpenPopper } from "./autocompletePopper";
import { getInput } from "./input";
import type { IFieldOptions } from "./types";

export {
	getInput as getTags,
	getInputWithSuggestionsWrapper as getTagsWrapper,
	checkInputSuggestions as checkTagsSuggestions,
} from "./input";

export async function addTagsValue(
	container: Page | Locator,
	options: IFieldOptions,
	value: string,
) {
	const input = getInput(container, options);

	await input.fill(value);
	await input.press("Enter");
}

export function getTagsChips(
	container: Page | Locator,
	options: IFieldOptions,
) {
	const input = getInput(container, options);

	return input.locator("..").locator(".MuiChip-root");
}

export async function getTagsValue(
	container: Page | Locator,
	options: IFieldOptions,
) {
	const chipNodes = await getTagsChips(container, options).all();

	return Promise.all(chipNodes.map((chipNode) => chipNode.textContent()));
}

export async function selectTagsSuggestion(
	container: Page | Locator,
	options: IFieldOptions,
	optionText: string,
) {
	const input = getInput(container, options);

	await input.dispatchEvent("mousedown");

	const popper = await waitForOpenPopper(input.page());

	const option = popper.getByText(optionText);

	await option.click();

	await expect(
		getTagsChips(container, options).getByText(optionText),
	).toBeVisible();

	await waitForClosePopper(input.page());
}

export async function removeTagsChip(
	container: Page | Locator,
	options: IFieldOptions,
	chip: string,
) {
	const chips = getTagsChips(container, options);

	const chipLabel = chips.getByText(chip);
	const chipWrapper = chipLabel.locator("..");

	const removeButton = chipWrapper.getByTestId("CancelIcon");

	await removeButton.click();
}
