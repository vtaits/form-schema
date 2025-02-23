import { expect, test } from "@playwright/test";
import {
	getFieldError,
	getInput,
	getInputWrapper,
	selectInputSuggestion,
	setInputValue,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import {
	getResult,
	getSubmitButton,
	parseSubmitValues,
} from "tests/utils/formExample";
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

const fieldOptions = {
	label: "Input",
	name: "input",
};

test.describe("change and submit correct value", () => {
	test("default input", async ({ page }) => {
		await page.goto(makeUrl({}));

		await expect(getInput(page, fieldOptions)).toHaveValue("");

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

		await setInputValue(page, fieldOptions, "Test");

		await expect(getInput(page, fieldOptions)).toHaveValue("Test");

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

		await setInputValue(page, fieldOptions, "");

		await expect(getInput(page, fieldOptions)).toHaveValue("");

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

		await expect(getInput(page, fieldOptions)).toHaveValue("");

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

		await setInputValue(page, fieldOptions, "1234");

		await expect(getInput(page, fieldOptions)).toHaveValue("1234");

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

		await setInputValue(page, fieldOptions, "");

		await expect(getInput(page, fieldOptions)).toHaveValue("");

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
				"options[0]": "test1",
				"options[1]": "test2",
			}),
		);

		await expect(getInput(page, fieldOptions)).toHaveValue("");

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

		await selectInputSuggestion(page, fieldOptions, "test1");

		await expect(getInput(page, fieldOptions)).toHaveValue("test1");

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

		await setInputValue(page, fieldOptions, "");

		await expect(getInput(page, fieldOptions)).toHaveValue("");

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
				"options[0]": "123",
				"options[1]": "456",
			}),
		);

		await expect(getInput(page, fieldOptions)).toHaveValue("");

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

		await selectInputSuggestion(page, fieldOptions, "456");

		await expect(getInput(page, fieldOptions)).toHaveValue("456");

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

		await setInputValue(page, fieldOptions, "");

		await expect(getInput(page, fieldOptions)).toHaveValue("");

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

test.describe("validation", () => {
	test("required", async ({ page }) => {
		await page.goto(
			makeUrl({
				required: "!true",
			}),
		);

		await getSubmitButton(page).click();

		// default html form validation
		await page.waitForTimeout(1000);

		await expect(getResult(page)).not.toBeVisible();

		// set a correct value and submit agait
		await setInputValue(page, fieldOptions, "abc");

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getInputWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: "abc",
			});
		}
	});

	test("minLenght", async ({ page }) => {
		await page.goto(
			makeUrl({
				min_length: "5",
			}),
		);

		await setInputValue(page, fieldOptions, "1234");

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		await expect(getFieldError(getInputWrapper(page, fieldOptions))).toHaveText(
			"This field must contain at least 5 letters",
		);

		await expect(getResult(page)).not.toBeVisible();

		// set a correct value and submit agait
		await setInputValue(page, fieldOptions, "abcdef");

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getInputWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: "abcdef",
			});
		}
	});

	test("maxLenght", async ({ page }) => {
		await page.goto(
			makeUrl({
				max_length: "5",
			}),
		);

		await setInputValue(page, fieldOptions, "123456");

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		await expect(getFieldError(getInputWrapper(page, fieldOptions))).toHaveText(
			"This field must contain no more than 5 letters",
		);

		await expect(getResult(page)).not.toBeVisible();

		// set a correct value and submit agait
		await setInputValue(page, fieldOptions, "abc");

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getInputWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: "abc",
			});
		}
	});

	test("number", async ({ page }) => {
		await page.goto(
			makeUrl({
				is_number: "!true",
			}),
		);

		await setInputValue(page, fieldOptions, "abc");

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		await expect(getFieldError(getInputWrapper(page, fieldOptions))).toHaveText(
			"The value should be a valid number",
		);

		await expect(getResult(page)).not.toBeVisible();

		// set a correct value and submit agait
		await setInputValue(page, fieldOptions, "123");

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getInputWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: 123,
			});
		}
	});

	test("regExp", async ({ page }) => {
		await page.goto(
			makeUrl({
				// TO DO: more complex regexp after fix https://github.com/storybookjs/storybook/issues/30140
				reg_exp: "test",
			}),
		);

		await setInputValue(page, fieldOptions, "abc");

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		await expect(getFieldError(getInputWrapper(page, fieldOptions))).toHaveText(
			"The value should satisfy the regular expression /test/",
		);

		await expect(getResult(page)).not.toBeVisible();

		// set a correct value and submit agait
		await setInputValue(page, fieldOptions, "test123");

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getInputWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				input: "test123",
			});
		}
	});
});
