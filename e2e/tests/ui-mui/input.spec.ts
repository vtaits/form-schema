import { expect, test } from "@playwright/test";
import {
	getInput,
	selectInputSuggestion,
	setInputValue,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import { getSubmitButton, parseSubmitValues } from "tests/utils/formExample";
import { createMakeUrl } from "tests/utils/makeUrl";

const makeUrl = createMakeUrl("react-form-schema-ui-mui-fields--input-story");

test.describe("screenshots", () => {
	for (const disabled of [false, true]) {
		for (const required of [false, true]) {
			for (const value of ["", "test"]) {
				const paramsStr = `disabled=${disabled},required=${required},value=${value}`;

				test(paramsStr, async ({ page }) => {
					await page.goto(
						makeUrl({
							disabled: `!${disabled}`,
							required: `!${required}`,
							form_value: value,
						}),
					);

					await expect(page.getByTestId("fields")).toHaveScreenshot(
						`${paramsStr}.png`,
					);
				});
			}
		}
	}
});

const inputOptions = {
	label: "Input",
	exact: true,
};

test.describe("change and submit correct value", () => {
	test("default input", async ({ page }) => {
		await page.goto(makeUrl({}));

		await expect(page.locator(".sb-loader").nth(0)).not.toBeVisible();

		await expect(getInput(page, inputOptions)).toHaveValue("");

		// submit initially empty

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: "",
			});
		}

		// change

		await setInputValue(page, inputOptions, "Test");

		await expect(getInput(page, inputOptions)).toHaveValue("Test");

		// submit changed

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: "Test",
			});
		}

		// clear

		await setInputValue(page, inputOptions, "");

		await expect(getInput(page, inputOptions)).toHaveValue("");

		// submit empty

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: "",
			});
		}
	});

	test("numeric input", async ({ page }) => {
		await page.goto(
			makeUrl({
				is_number: "!true",
			}),
		);

		await expect(page.locator(".sb-loader").nth(0)).not.toBeVisible();

		await expect(getInput(page, inputOptions)).toHaveValue("");

		// submit initially empty

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: null,
			});
		}

		// change

		await setInputValue(page, inputOptions, "1234");

		await expect(getInput(page, inputOptions)).toHaveValue("1234");

		// submit changed

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: 1234,
			});
		}

		// clear

		await setInputValue(page, inputOptions, "");

		await expect(getInput(page, inputOptions)).toHaveValue("");

		// submit empty

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: null,
			});
		}
	});

	test("default with options", async ({ page }) => {
		await page.goto(
			makeUrl({
				"options.0": "test1",
				"options.1": "test2",
			}),
		);

		await expect(page.locator(".sb-loader").nth(0)).not.toBeVisible();

		await expect(getInput(page, inputOptions)).toHaveValue("");

		// submit initially empty

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: "",
			});
		}

		// change

		await selectInputSuggestion(page, inputOptions, "test1");

		await expect(getInput(page, inputOptions)).toHaveValue("test1");

		// submit changed

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: "test1",
			});
		}

		// clear

		await setInputValue(page, inputOptions, "");

		await expect(getInput(page, inputOptions)).toHaveValue("");

		// submit empty

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: "",
			});
		}
	});

	test("numeric with options", async ({ page }) => {
		await page.goto(
			makeUrl({
				is_number: "!true",
				"options.0": "123",
				"options.1": "456",
			}),
		);

		await expect(page.locator(".sb-loader").nth(0)).not.toBeVisible();

		await expect(getInput(page, inputOptions)).toHaveValue("");

		// submit initially empty

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: null,
			});
		}

		// change

		await selectInputSuggestion(page, inputOptions, "456");

		await expect(getInput(page, inputOptions)).toHaveValue("456");

		// submit changed

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: 456,
			});
		}

		// clear

		await setInputValue(page, inputOptions, "");

		await expect(getInput(page, inputOptions)).toHaveValue("");

		// submit empty

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: null,
			});
		}
	});
});
