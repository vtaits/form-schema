import type { Page } from "@playwright/test";
import { unwrap } from "krustykrab";

export function getSubmitButton(page: Page) {
	return page.getByText("Submit", { exact: true });
}

export async function parseSubmitValues(page: Page) {
	const resText = await page.locator("#storybook-root pre").textContent();

	return JSON.parse(unwrap(resText));
}
