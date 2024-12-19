import { type Page, expect } from "@playwright/test";

function getMenuByName(page: Page, name: string) {
	return page.locator(`[id="menu-${name}"]`);
}

export async function waitForOpenSelect(page: Page, name: string) {
	const menu = getMenuByName(page, name);

	await expect(menu).toBeVisible();

	return menu;
}

export async function waitForCloseSelect(page: Page, name: string) {
	await expect(getMenuByName(page, name)).not.toBeVisible();
}
