import { act, fireEvent, within } from "@testing-library/react";
import { waitForCloseSelect, waitForOpenSelect } from "./autocompleteSelect";
import { queryInput } from "./input";

export { queryInput as querySelect } from "./input";

export async function getSelectSuggestions(
	container: HTMLElement,
	name: string,
	label?: string | null,
) {
	const input = queryInput(container, name, label);

	if (!input) {
		return [];
	}

	act(() => {
		fireEvent.click(input);
	});

	const selectList = await waitForOpenSelect(name);

	if (!selectList) {
		return [];
	}

	const options = within(selectList as HTMLElement).queryAllByRole("option");

	act(() => {
		fireEvent.click(input);
	});

	await waitForCloseSelect(name);

	return options;
}

export async function selectValue(
	container: HTMLElement,
	name: string,
	label: string | null,
	optionText: string,
) {
	const input = queryInput(container, name, label);

	if (!input) {
		throw new Error(`Input with name "${name}" not found`);
	}

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
