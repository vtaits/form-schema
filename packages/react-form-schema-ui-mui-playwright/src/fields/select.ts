import type { Locator, Page } from "@playwright/test";
import { waitForCloseSelect, waitForOpenSelect } from "./autocompleteSelect";
import { getInput, getInputWrapper } from "./input";
import type { IFieldOptions } from "./types";

export {
	getInput as getSelect,
	getInputWrapper as getSelectWrapper,
} from "./input";

export async function checkSelectSuggestions(
	container: Page | Locator,
	options: IFieldOptions,
	check: (optionList: Locator) => Promise<void>,
) {
	const input = getInput(container, options);

	await input.click();

	const nameAttr = await input.getAttribute("name");
	const name = nameAttr || "";

	const selectList = await waitForOpenSelect(input.page(), name);

	const optionList = selectList.getByRole("option");

	await check(optionList);

	await input.click();

	await waitForCloseSelect(input.page(), name);
}

export async function selectValue(
	container: Page | Locator,
	options: IFieldOptions,
	optionText: string,
) {
	const input = getInput(container, options);
	const nameAttr = await input.getAttribute("name");
	const name = nameAttr || "";

	const fieldWrapper = getInputWrapper(container, options);

	const openButton = fieldWrapper.getByRole("combobox", {
		includeHidden: true,
	});

	await openButton.dispatchEvent("mousedown");

	const selectList = await waitForOpenSelect(input.page(), name);

	const option = selectList.getByText(optionText);

	await option.click();
}

export async function selectMulipleValue(
	container: Page | Locator,
	options: IFieldOptions,
	optionTexts: readonly string[],
) {
	const input = getInput(container, options);
	const nameAttr = await input.getAttribute("name");
	const name = nameAttr || "";

	const fieldWrapper = getInputWrapper(container, options);

	const openButton = fieldWrapper.getByRole("combobox", {
		includeHidden: true,
	});

	await openButton.dispatchEvent("mousedown");

	const selectList = await waitForOpenSelect(input.page(), name);

	for (const optionText of optionTexts) {
		const option = selectList.getByText(optionText);
		await option.click();
	}

	await input.page().keyboard.press("Escape");
}

export async function getSelectText(
	container: Page | Locator,
	options: IFieldOptions,
) {
	const fieldWrapper = getInputWrapper(container, options);

	const combobox = fieldWrapper.getByRole("combobox", {
		includeHidden: true,
	});

	const textContent = await combobox.textContent();

	return textContent;
}
