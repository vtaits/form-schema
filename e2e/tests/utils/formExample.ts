import type { Page } from "@playwright/test";
import { unwrap } from "krustykrab";

export function getSubmitButton(page: Page) {
	return page.getByText("Submit", { exact: true });
}

export function getResult(page: Page) {
	return page.locator("#storybook-root pre");
}

export async function parseSubmitValues(page: Page) {
	const resText = await getResult(page).textContent();

	return JSON.parse(unwrap(resText));
}
