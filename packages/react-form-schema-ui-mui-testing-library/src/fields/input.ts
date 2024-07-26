import { act, fireEvent, within } from "@testing-library/react";
import { waitForClosePopper, waitForOpenPopper } from "./autocompletePopper";

export function queryInput(
	container: HTMLElement,
	name: string,
	label?: string | null,
) {
	const input = container.querySelector(`input[name="${name}"]`);

	if (!input) {
		return null;
	}

	const fieldWrapper = input.closest(".MuiBox-root");

	if (!fieldWrapper) {
		return null;
	}

	if (
		label &&
		!within(fieldWrapper as HTMLElement).queryByText(label, {
			selector: "label",
		})
	) {
		return null;
	}

	return input;
}

export function setInputValue(
	container: HTMLElement,
	name: string,
	label: string | null,
	value: string,
) {
	const input = queryInput(container, name, label);

	if (!input) {
		throw new Error(`Input with name "${name}" not found`);
	}

	act(() => {
		fireEvent.change(input, {
			target: {
				value,
			},
		});
	});
}

export async function getInputSuggestions(
	container: HTMLElement,
	name: string,
	label?: string | null,
) {
	const input = queryInput(container, name, label);

	if (!input) {
		return [];
	}

	act(() => {
		fireEvent.focus(input);
	});

	const popper = await waitForOpenPopper();

	if (!popper) {
		return [];
	}

	const options = within(popper as HTMLElement).queryAllByRole("option");

	act(() => {
		fireEvent.blur(input);
	});

	await waitForClosePopper();

	return options;
}

export async function selectInputSuggestion(
	container: HTMLElement,
	name: string,
	label: string | null,
	optionText: string,
) {
	const input = queryInput(container, name, label);

	if (!input) {
		throw new Error(`Input with name "${name}" not found`);
	}

	act(() => {
		fireEvent.mouseDown(input);
	});

	const popper = await waitForOpenPopper();

	if (!popper) {
		throw new Error(`Popper for input with name "${name}" not found`);
	}

	const option = within(popper as HTMLElement).getByText(optionText);

	act(() => {
		fireEvent.click(option);
	});

	await waitForClosePopper();
}
