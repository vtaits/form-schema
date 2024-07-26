import { act, fireEvent, within } from "@testing-library/react";

export function queryCheckbox(
	container: HTMLElement,
	name: string,
	label?: string,
) {
	const inputNodes = container.querySelectorAll(
		`[name="${name}"][type="checkbox"]`,
	);

	if (inputNodes.length === 0) {
		return null;
	}

	const suitableNodes = [...inputNodes].filter((input) => {
		const fieldWrapper = input.closest(".MuiFormControlLabel-root");

		if (!fieldWrapper) {
			return false;
		}

		if (label && !within(fieldWrapper as HTMLElement).queryByText(label)) {
			return false;
		}

		return true;
	});

	if (suitableNodes.length > 1) {
		throw new Error(
			`There are more than one checkboxes with name "${name}" and label "${label}"`,
		);
	}

	return suitableNodes[0];
}

export function toggleCheckbox(
	container: HTMLElement,
	name: string,
	label?: string,
) {
	const checkbox = queryCheckbox(container, name, label);

	if (!checkbox) {
		throw new Error(`Checkbox with name "${name}" not found`);
	}

	act(() => {
		fireEvent.click(checkbox);
	});
}
