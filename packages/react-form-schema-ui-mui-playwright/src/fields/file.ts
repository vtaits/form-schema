import { act, fireEvent, within } from "@testing-library/react";

function makeFile(name: string) {
	const content = "test content";
	const options = { type: "text/plain" };

	const blob = new Blob([content], options);

	return new File([blob], name, options);
}

export function queryFileInputWrapper(
	container: HTMLElement,
	name: string,
	label?: string | null,
) {
	const input = container.querySelector(`input[type="file"][name="${name}"]`);

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

	return fieldWrapper as HTMLElement;
}

export function queryFileInput(
	container: HTMLElement,
	name: string,
	label?: string | null,
) {
	const input = container.querySelector(`input[type="file"][name="${name}"]`);

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

	return input as HTMLInputElement;
}

export function selectFile(
	container: HTMLElement,
	name: string,
	label: string | null | undefined,
	fileName: string,
) {
	const fileInput = queryFileInput(container, name, label);

	if (!fileInput) {
		throw new Error(`File input with name "${name}" not found`);
	}

	const file = makeFile(fileName);

	act(() => {
		fireEvent.change(fileInput, {
			target: {
				files: [file],
			},
		});
	});
}

export async function querySelectedFileName(
	container: HTMLElement,
	name: string,
	label?: string | null,
) {
	const fieldWrapper = queryFileInputWrapper(container, name, label);

	if (!fieldWrapper) {
		return null;
	}

	return within(fieldWrapper).queryByTestId("filename");
}

export async function removeFile(
	container: HTMLElement,
	name: string,
	label?: string | null,
) {
	const fieldWrapper = queryFileInputWrapper(container, name, label);

	if (!fieldWrapper) {
		throw new Error(`File input with name "${name}" not found`);
	}

	const file = within(fieldWrapper).getByTestId("file");

	const removeButton = within(file).getByLabelText("Remove");

	act(() => {
		fireEvent.click(removeButton);
	});
}
