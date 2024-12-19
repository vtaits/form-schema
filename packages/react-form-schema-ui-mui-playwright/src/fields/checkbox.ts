import type { Locator, Page } from "@playwright/test";
import type { IFieldOptions } from "./types";

export function getCheckboxInput(
	container: Page | Locator,
	{ label, name, exact }: IFieldOptions,
) {
	if (label) {
		const checkboxLabel = container.getByText(label, {
			exact,
		});

		const input = checkboxLabel.locator("..").getByRole("checkbox");

		if (name) {
			return input.filter({
				has: name
					? checkboxLabel.page().locator("..").locator(`input[name="${name}"]`)
					: undefined,
			});
		}

		return input;
	}

	return container.locator(`input[type="checkbox"][name="${name}"]`);
}

export function getCheckboxWrapper(
	container: Page | Locator,
	options: IFieldOptions,
) {
	return getCheckboxInput(container, options)
		.locator("..")
		.locator("..")
		.locator("..");
}

export async function toggleCheckbox(
	container: Page | Locator,
	options: IFieldOptions,
) {
	const checkboxInput = getCheckboxInput(container, options);

	await checkboxInput.click();
}
