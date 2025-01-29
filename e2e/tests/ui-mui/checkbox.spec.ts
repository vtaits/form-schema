import { expect, test } from "@playwright/test";
import {
	getCheckboxInput,
	toggleCheckbox,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import { getSubmitButton, parseSubmitValues } from "tests/utils/formExample";
import { createMakeUrl } from "tests/utils/makeUrl";

const makeUrl = createMakeUrl(
	"react-form-schema-ui-mui-fields--checkbox-story",
);

test.describe("screenshots", () => {
	for (const disabled of [false, true]) {
		for (const required of [false, true]) {
			for (const checked of [false, true]) {
				const paramsStr = `disabled=${disabled},required=${required},checked=${checked}`;

				test(paramsStr, async ({ page }) => {
					await page.goto(
						makeUrl({
							disabled: `!${disabled}`,
							required: `!${required}`,
							form_value: checked ? "true" : undefined,
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

const checkboxOptions = {
	label: "Checkbox",
};

test.describe("change and submit correct value", () => {
	const testCases = [
		{
			rawIsInverse: undefined,
			isValueInverse: false,
		},

		{
			rawIsInverse: false,
			isValueInverse: false,
		},

		{
			rawIsInverse: true,
			isValueInverse: true,
		},
	];

	for (const testCase of testCases) {
		test(`isValueInverse = ${testCase.rawIsInverse}`, async ({ page }) => {
			await page.goto(
				makeUrl({
					is_value_inverse:
						typeof testCase.rawIsInverse === "boolean"
							? `!${testCase.rawIsInverse}`
							: undefined,
				}),
			);

			if (testCase.isValueInverse) {
				await expect(getCheckboxInput(page, checkboxOptions)).toBeChecked();
			} else {
				await expect(getCheckboxInput(page, checkboxOptions)).not.toBeChecked();
			}

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

			if (testCase.isValueInverse) {
				await expect(getCheckboxInput(page, checkboxOptions)).not.toBeChecked();
			} else {
				await expect(getCheckboxInput(page, checkboxOptions)).toBeChecked();
			}

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

			if (testCase.isValueInverse) {
				await expect(getCheckboxInput(page, checkboxOptions)).toBeChecked();
			} else {
				await expect(getCheckboxInput(page, checkboxOptions)).not.toBeChecked();
			}

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
	}
});
