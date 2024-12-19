import { expect, test } from "@playwright/test";

const BASE_URL =
	"http://localhost:6006/iframe.html?id=react-form-schema-ui-mui-fields--checkbox-story";

test.describe("render", () => {
	test("default", async ({ page }) => {
		page.goto(BASE_URL);

		await expect(page.getByTestId("fields")).toHaveScreenshot();
	});

	test("checked", async ({ page }) => {
		page.goto(BASE_URL);

		await page
			.getByText("Checkbox", {
				exact: true,
			})
			.click();

		await expect(page.getByTestId("fields")).toHaveScreenshot();
	});

	test("disabled", async ({ page }) => {
		page.goto(`${BASE_URL}&args=disabled:!true`);

		await expect(page.getByTestId("fields")).toHaveScreenshot();
	});

	test("required", async ({ page }) => {
		page.goto(`${BASE_URL}&args=required:!true`);

		await expect(page.getByTestId("fields")).toHaveScreenshot();
	});
});
