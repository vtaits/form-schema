import { expect, test } from "@playwright/test";
import {
	getFieldError,
	getSelectText,
	getSelectWrapper,
	selectMulipleValue,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import { createMakeUrl } from "tests/utils/makeUrl";
import {
	getResult,
	getSubmitButton,
	parseSubmitValues,
} from "../utils/formExample";

const makeUrl = createMakeUrl(
	"react-form-schema-ui-mui-fields--multi-select-story",
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

const fieldOptions = {
	label: "Multi select",
	name: "multiSelect",
};

test("change and submit correct value", async ({ page }) => {
	await page.goto(makeUrl({}));

	// submit initially empty

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			multiSelect: [],
		});
	}

	// change

	await selectMulipleValue(page, fieldOptions, ["Label 1", "Label 3"]);

	{
		const selectText = await getSelectText(page, fieldOptions);
		expect(selectText).toBe("Label 1, Label 3");
	}

	// submit checked

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			multiSelect: ["value1", "value3"],
		});
	}

	// uncheck

	await selectMulipleValue(page, fieldOptions, ["Label 1"]);

	{
		const selectText = await getSelectText(page, fieldOptions);
		expect(selectText).toBe("Label 3");
	}

	// submit unchecked

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			multiSelect: ["value3"],
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
		await selectMulipleValue(page, fieldOptions, ["Label 1"]);

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getSelectWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				multiSelect: ["value1"],
			});
		}
	});

	test("minLenght", async ({ page }) => {
		await page.goto(
			makeUrl({
				min_length: "2",
			}),
		);

		await selectMulipleValue(page, fieldOptions, ["Label 1"]);

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		await expect(
			getFieldError(getSelectWrapper(page, fieldOptions)),
		).toHaveText("This field must contain at least 2 elements");

		await expect(getResult(page)).not.toBeVisible();

		// set a correct value and submit agait
		await selectMulipleValue(page, fieldOptions, ["Label 3"]);

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getSelectWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				multiSelect: ["value1", "value3"],
			});
		}
	});

	test("maxLenght", async ({ page }) => {
		await page.goto(
			makeUrl({
				max_length: "1",
			}),
		);

		await selectMulipleValue(page, fieldOptions, ["Label 1", "Label 3"]);

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		await expect(
			getFieldError(getSelectWrapper(page, fieldOptions)),
		).toHaveText("This field must contain no more than 1 elements");

		await expect(getResult(page)).not.toBeVisible();

		// set a correct value and submit agait
		await selectMulipleValue(page, fieldOptions, ["Label 1"]);

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getSelectWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				multiSelect: ["value3"],
			});
		}
	});
});
