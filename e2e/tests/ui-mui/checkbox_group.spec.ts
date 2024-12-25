import { expect, test } from "@playwright/test";
import {
	getCheckboxInput,
	toggleCheckbox,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import { createMakeUrl } from "tests/utils/makeUrl";
import { getSubmitButton, parseSubmitValues } from "../utils/formExample";

const makeUrl = createMakeUrl(
	"react-form-schema-ui-mui-fields--checkbox-group-story",
);

test.describe("screenshots", () => {
	for (const disabled of [false, true]) {
		for (const required of [false, true]) {
			for (const value of [
				{ label: "empty", value: {} },
				{
					label: "[value1,value3]",
					value: { "form_value.0": "value1", "form_value.1": "value3" },
				},
			]) {
				const paramsStr = `disabled=${disabled},required=${required},value=${value.label}`;

				test(paramsStr, async ({ page }) => {
					await page.goto(
						makeUrl({
							disabled: `!${disabled}`,
							required: `!${required}`,
							...value.value,
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

const label1Options = {
	label: "Label 1",
};

const label2Options = {
	label: "Label 2",
};

const label3Options = {
	label: "Label 3",
};

test("change and submit correct value", async ({ page }) => {
	await page.goto(makeUrl({}));

	// submit initially empty

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			checkboxGroup: [],
		});
	}

	// change

	await toggleCheckbox(page, label1Options);
	await toggleCheckbox(page, label3Options);

	await expect(getCheckboxInput(page, label1Options)).toBeChecked();
	await expect(getCheckboxInput(page, label2Options)).not.toBeChecked();
	await expect(getCheckboxInput(page, label3Options)).toBeChecked();

	// submit checked

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			checkboxGroup: ["value1", "value3"],
		});
	}

	// uncheck

	await toggleCheckbox(page, label1Options);

	await expect(getCheckboxInput(page, label1Options)).not.toBeChecked();
	await expect(getCheckboxInput(page, label2Options)).not.toBeChecked();
	await expect(getCheckboxInput(page, label3Options)).toBeChecked();

	// submit unchecked

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			checkboxGroup: ["value3"],
		});
	}
});
