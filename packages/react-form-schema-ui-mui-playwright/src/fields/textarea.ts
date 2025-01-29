import type { Locator, Page } from "@playwright/test";
import type { IFieldOptions } from "./types";

export function getTextarea(
	container: Page | Locator,
	{ label, name, exact }: IFieldOptions,
) {
	if (label) {
		const inputLabel = container.getByText(label, {
			exact,
		});

		const input = inputLabel.locator("..").getByRole("textbox");

		if (name) {
			return input.filter({
				has: name
					? inputLabel.page().locator("..").locator(`textarea[name="${name}"]`)
					: undefined,
			});
		}

		return input;
	}

	return container.locator(`textarea[name="${name}"]`);
}

export function getTextareaWrapper(
	container: Page | Locator,
	options: IFieldOptions,
) {
	return getTextarea(container, options)
		.locator("..")
		.locator("..")
		.locator("..");
}

export async function setTextareaValue(
	container: Page | Locator,
	options: IFieldOptions,
	value: string,
) {
	const textarea = getTextarea(container, options);

	await textarea.fill(value);
}
