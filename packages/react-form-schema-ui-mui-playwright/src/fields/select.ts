import { act, fireEvent, within } from "@testing-library/react";
import { waitForCloseSelect, waitForOpenSelect } from "./autocompleteSelect";
import { getInput } from "./input";
import { Locator, Page } from "@playwright/test";
import { IFieldOptions } from "./types";

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

	const selectList = await waitForOpenSelect(input.page(), name);

	const optionList = selectList.getByRole("option");

	await check(optionList);

	await input.click();

	act(() => {
		fireEvent.click(input);
	});

	await waitForCloseSelect(input.page(), name);

	return options;
}

export async function selectValue(
	container: Page | Locator,
	options: IFieldOptions,
	optionText: string,
) {
	const input = getInput(container, options);

	const fieldWrapper = input.closest(".MuiBox-root");

	if (!fieldWrapper) {
		return;
	}

	const openButton = within(fieldWrapper as HTMLElement).getByRole("combobox", {
		hidden: true,
	});

	act(() => {
		fireEvent.mouseDown(openButton);
	});

	const selectList = await waitForOpenSelect(name);

	if (!selectList) {
		throw new Error(`select list "${name}" is not found`);
	}

	const option = within(selectList as HTMLElement).getByText(optionText);

	act(() => {
		fireEvent.click(option);
	});
}

export function getSelectText(
	container: HTMLElement,
	name: string,
	label: string | null,
) {
	const input = queryInput(container, name, label);

	if (!input?.parentNode) {
		throw new Error(`Input with name "${name}" not found`);
	}

	return within(input.parentNode as HTMLElement).getByRole("combobox", {
		hidden: true,
	}).textContent;
}
