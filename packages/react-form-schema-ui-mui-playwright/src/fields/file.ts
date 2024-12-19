import type { Locator, Page } from "@playwright/test";
import type { IFieldOptions } from "./types";

export function getFileInput(
	container: Page | Locator,
	{ label, name, exact }: IFieldOptions,
) {
	if (label) {
		const inputLabel = container.getByText(label, {
			exact,
		});

		const input = inputLabel.locator(
			name ? `input[type="file"][name="${name}"]` : 'input[type="file"]',
		);

		return input;
	}

	return container.locator(`input[type="file"][name="${name}"]`);
}

export function getFileInputWrapper(
	container: Page | Locator,
	options: IFieldOptions,
) {
	const input = getFileInput(container, options);

	const fieldWrapper = input.locator("..");

	return fieldWrapper;
}

export async function selectFile(
	container: Page | Locator,
	options: IFieldOptions,
	filePath: string,
) {
	const fileInput = getFileInput(container, options);

	const page = fileInput.page();

	const fileChooserPromise = page.waitForEvent("filechooser");
	await fileInput.locator("..").click();
	const fileChooser = await fileChooserPromise;
	await fileChooser.setFiles(filePath);
}

export function getSelectedFileName(
	container: Page | Locator,
	options: IFieldOptions,
) {
	const fieldWrapper = getFileInputWrapper(container, options);

	return fieldWrapper.getByTestId("filename");
}

export async function removeFile(
	container: Page | Locator,
	options: IFieldOptions,
) {
	const fieldWrapper = getFileInputWrapper(container, options);

	const file = fieldWrapper.getByTestId("file");

	const removeButton = file.getByLabel("Remove");

	await removeButton.click();
}
