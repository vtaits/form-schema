import { expect, test } from "@playwright/test";
import {
	getFieldError,
	getTextarea,
	getTextareaWrapper,
	setTextareaValue,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import {
	getResult,
	getSubmitButton,
	parseSubmitValues,
} from "tests/utils/formExample";
import { createMakeUrl } from "tests/utils/makeUrl";

const makeUrl = createMakeUrl(
	"react-form-schema-ui-mui-fields--textarea-story",
);

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
	label: "Textarea",
	name: "textarea",
};

test("change and submit correct value", async ({ page }) => {
	await page.goto(makeUrl({}));

	await expect(getTextarea(page, fieldOptions)).toHaveValue("");

	// submit initially empty

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			textarea: "",
		});
	}

	// change

	await setTextareaValue(page, fieldOptions, "Test");

	await expect(getTextarea(page, fieldOptions)).toHaveValue("Test");

	// submit changed

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			textarea: "Test",
		});
	}

	// clear

	await setTextareaValue(page, fieldOptions, "");

	await expect(getTextarea(page, fieldOptions)).toHaveValue("");

	// submit empty

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			textarea: "",
		});
	}
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
		await setTextareaValue(page, fieldOptions, "abc");

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getTextareaWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				textarea: "abc",
			});
		}
	});

	test("minLenght", async ({ page }) => {
		await page.goto(
			makeUrl({
				min_length: "5",
			}),
		);

		await setTextareaValue(page, fieldOptions, "1234");

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		await expect(
			getFieldError(getTextareaWrapper(page, fieldOptions)),
		).toHaveText("This field must contain at least 5 letters");

		await expect(getResult(page)).not.toBeVisible();

		// set a correct value and submit agait
		await setTextareaValue(page, fieldOptions, "abcdef");

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getTextareaWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				textarea: "abcdef",
			});
		}
	});

	test("maxLenght", async ({ page }) => {
		await page.goto(
			makeUrl({
				max_length: "5",
			}),
		);

		await setTextareaValue(page, fieldOptions, "123456");

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		await expect(
			getFieldError(getTextareaWrapper(page, fieldOptions)),
		).toHaveText("This field must contain no more than 5 letters");

		await expect(getResult(page)).not.toBeVisible();

		// set a correct value and submit agait
		await setTextareaValue(page, fieldOptions, "abc");

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getTextareaWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				textarea: "abc",
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

		await setTextareaValue(page, fieldOptions, "abc");

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		await expect(
			getFieldError(getTextareaWrapper(page, fieldOptions)),
		).toHaveText("The value should satisfy the regular expression /test/");

		await expect(getResult(page)).not.toBeVisible();

		// set a correct value and submit agait
		await setTextareaValue(page, fieldOptions, "test123");

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getTextareaWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				textarea: "test123",
			});
		}
	});
});
