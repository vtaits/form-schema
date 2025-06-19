import { expect, type Page } from "@playwright/test";

function getPopper(page: Page) {
	return page.locator(".MuiAutocomplete-popper");
}

export async function waitForOpenPopper(page: Page) {
	const popper = getPopper(page);

	await expect(popper).toBeVisible();

	return popper;
}

export async function waitForClosePopper(page: Page) {
	await expect(getPopper(page)).not.toBeVisible();
}
