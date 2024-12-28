import type { Locator, Page } from "@playwright/test";
import type { IFieldOptions } from "./types";

export function getRadioGroupWrapper(
	container: Page | Locator,
	{ label, name, exact }: IFieldOptions,
) {
	if (label) {
		const checkboxGroupLabel = container.getByText(label, {
			exact,
		});

		if (name) {
			return checkboxGroupLabel
				.locator("..")
				.locator("..")
				.getByTestId(`@@radioGroup/${name}`)
				.locator("..");
		}

		return checkboxGroupLabel.locator("..").locator("..");
	}

	return container.getByTestId(`@@radioGroup/${name}`).locator("..");
}
