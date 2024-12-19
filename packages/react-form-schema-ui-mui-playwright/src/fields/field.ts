import type { Locator } from "@playwright/test";

export function queryFieldError(fieldWrapper: Locator) {
	return fieldWrapper.locator('[data-testid^="@@error/"]');
}
