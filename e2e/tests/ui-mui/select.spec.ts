import { expect, test } from "@playwright/test";
import {
	getFieldError,
	getSelectText,
	getSelectWrapper,
	selectValue,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import { createMakeUrl } from "tests/utils/makeUrl";
import {
	getResult,
	getSubmitButton,
	parseSubmitValues,
} from "../utils/formExample";

const makeUrl = createMakeUrl("react-form-schema-ui-mui-fields--select-story");

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

const fieldOptions = {
	label: "Select",
	name: "select",
};

test("change and submit correct value", async ({ page }) => {
	await page.goto(makeUrl({}));

	// submit initially empty

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			select: null,
		});
	}

	// change

	await selectValue(page, fieldOptions, "Label 2");

	{
		const selectText = await getSelectText(page, fieldOptions);
		expect(selectText).toBe("Label 2");
	}

	// submit changed

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			select: "value2",
		});
	}

	// clean

	await selectValue(page, fieldOptions, "Select");

	{
		const selectText = await getSelectText(page, fieldOptions);
		expect(selectText).toBe("Select");
	}

	// submit empty

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			select: null,
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

		await expect(getResult(page)).not.toBeVisible();
		await expect(
			getFieldError(getSelectWrapper(page, fieldOptions)),
		).toHaveText("This field is required");

		// set a correct value and submit agait
		await selectValue(page, fieldOptions, "Label 1");

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getSelectWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				select: "value1",
			});
		}
	});
});
