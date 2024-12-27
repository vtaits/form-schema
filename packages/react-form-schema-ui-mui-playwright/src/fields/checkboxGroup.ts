import type { Locator, Page } from "@playwright/test";
import type { IFieldOptions } from "./types";

export function getCheckboxGroupWrapper(
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
				.getByTestId(`@@checkboxGroup/${name}`)
				.locator("..");
		}

		return checkboxGroupLabel.locator("..").locator("..");
	}

	return container.getByTestId(`@@checkboxGroup/${name}`).locator("..");
}
