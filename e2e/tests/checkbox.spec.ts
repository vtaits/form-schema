import { expect, test } from "@playwright/test";
import {
	getCheckboxInput,
	toggleCheckbox,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import { getSubmitButton, parseSubmitValues } from "./utils";

const BASE_URL =
	"http://localhost:6006/iframe.html?id=react-form-schema-ui-mui-fields--checkbox-story";

test.describe("screenshots", () => {
	for (const disabled of [false, true]) {
		for (const required of [false, true]) {
			for (const checked of [false, true]) {
				const paramsStr = `disabled=${disabled},required=${required},checked=${checked}`;

				test(paramsStr, async ({ page }) => {
					await page.goto(
						`${BASE_URL}&args=${encodeURIComponent(`disabled:!${disabled};required:!${required};formValue:!${checked}`)}`,
					);

					await expect(page.getByTestId("fields")).toHaveScreenshot(
						`${paramsStr}.png`,
					);
				});
			}
		}
	}
});

const checkboxOptions = {
	label: "Checkbox",
};

test("change and submit correct value", async ({ page }) => {
	await page.goto(BASE_URL);

	// submit initially unchecked

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			checkbox: false,
		});
	}

	// check

	await toggleCheckbox(page, checkboxOptions);

	await expect(getCheckboxInput(page, checkboxOptions)).toBeChecked();

	// submit checked

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			checkbox: true,
		});
	}

	// uncheck

	await toggleCheckbox(page, checkboxOptions);

	await expect(getCheckboxInput(page, checkboxOptions)).not.toBeChecked();

	// submit unchecked

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			checkbox: false,
		});
	}
});
