import type { Locator, Page } from "@playwright/test";

export function getFormError(container: Page | Locator) {
	return container.getByTestId("@@form/error").locator(".MuiAlert-message");
}
