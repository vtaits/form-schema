import type { Locator, Page } from "@playwright/test";
import type { IFieldOptions } from "./types";

export function getRadioInput(
	container: Page | Locator,
	{ label, name, exact }: IFieldOptions,
) {
	if (label) {
		const radioLabel = container.getByText(label, {
			exact,
		});

		const input = radioLabel.locator("..").locator('input[type="radio"]');

		if (name) {
			return input.filter({
				has: name
					? radioLabel.page().locator("..").locator(`input[name="${name}"]`)
					: undefined,
			});
		}

		return input;
	}

	return container.locator(`input[type="radio"][name="${name}"]`);
}

export function getRadioWrapper(
	container: Page | Locator,
	options: IFieldOptions,
) {
	return getRadioInput(container, options)
		.locator("..")
		.locator("..")
		.locator("..");
}

export async function toggleRadio(
	container: Page | Locator,
	options: IFieldOptions,
) {
	const radio = getRadioInput(container, options);

	await radio.click();
}
