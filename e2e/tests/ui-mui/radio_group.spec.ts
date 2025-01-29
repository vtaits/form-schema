import { expect, test } from "@playwright/test";
import {
	getFieldError,
	getRadioGroupWrapper,
	getRadioInput,
	toggleRadio,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import { createMakeUrl } from "tests/utils/makeUrl";
import {
	getResult,
	getSubmitButton,
	parseSubmitValues,
} from "../utils/formExample";

const makeUrl = createMakeUrl(
	"react-form-schema-ui-mui-fields--radio-group-story",
);

test.describe("screenshots", () => {
	for (const disabled of [false, true]) {
		for (const required of [false, true]) {
			for (const value of [
				{ label: "empty", value: {} },
				{
					label: "value2",
					value: { form_value: "value2" },
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
			radioGroup: null,
		});
	}

	// change

	await toggleRadio(page, label1Options);
	await toggleRadio(page, label3Options);

	await expect(getRadioInput(page, label1Options)).not.toBeChecked();
	await expect(getRadioInput(page, label2Options)).not.toBeChecked();
	await expect(getRadioInput(page, label3Options)).toBeChecked();

	// submit checked

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			radioGroup: "value3",
		});
	}
});

const radioGroupOptions = {
	label: "Radio group",
	name: "radioGroup",
};

test.describe("validation", () => {
	test("required", async ({ page }) => {
		await page.goto(
			makeUrl({
				required: "!true",
			}),
		);

		await getSubmitButton(page).click();

		await expect(getResult(page)).not.toBeVisible();
		await expect(
			getFieldError(getRadioGroupWrapper(page, radioGroupOptions)),
		).toHaveText("This field is required");

		// set a correct value and submit agait
		await toggleRadio(page, label1Options);

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getRadioGroupWrapper(page, radioGroupOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				radioGroup: "value1",
			});
		}
	});
});
