import { act, fireEvent, within } from "@testing-library/react";

export function queryTextarea(
	container: HTMLElement,
	name: string,
	label?: string | null,
) {
	const textarea = container.querySelector(`textarea[name="${name}"]`);

	if (!textarea) {
		return null;
	}

	const fieldWrapper = textarea.closest(".MuiBox-root");

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

	return textarea;
}

export function setTextareaValue(
	container: HTMLElement,
	name: string,
	label: string | null,
	value: string,
) {
	const textarea = queryTextarea(container, name, label);

	if (!textarea) {
		throw new Error(`Textarea with name "${name}" not found`);
	}

	act(() => {
		fireEvent.change(textarea, {
			target: {
				value,
			},
		});
	});
}
