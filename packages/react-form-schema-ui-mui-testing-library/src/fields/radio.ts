import { act, fireEvent, within } from "@testing-library/react";

export function queryRadio(
	container: HTMLElement,
	name: string,
	label?: string,
) {
	const inputNodes = container.querySelectorAll(
		`[name="${name}"][type="radio"]`,
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
			`There are more than one radios with name "${name}" and label "${label}"`,
		);
	}

	return suitableNodes[0];
}

export function toggleRadio(
	container: HTMLElement,
	name: string,
	label?: string,
) {
	const radio = queryRadio(container, name, label);

	if (!radio) {
		throw new Error(`Radio with name "${name}" not found`);
	}

	act(() => {
		fireEvent.click(radio);
	});
}
