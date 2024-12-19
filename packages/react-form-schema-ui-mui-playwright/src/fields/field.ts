import type { Locator } from "@playwright/test";

export function getFieldError(fieldWrapper: Locator) {
	return fieldWrapper.locator('[data-testid^="@@error/"]');
}
