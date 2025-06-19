import { expect, test } from "@playwright/test";
import {
	addTagsValue,
	getFieldError,
	getTagsValue,
	getTagsWrapper,
	removeTagsChip,
	selectTagsSuggestion,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import { createMakeUrl } from "tests/utils/makeUrl";
import {
	getResult,
	getSubmitButton,
	parseSubmitValues,
} from "../utils/formExample";

const makeUrl = createMakeUrl("react-form-schema-ui-mui-fields--tags-story");

test.describe("screenshots", () => {
	for (const disabled of [false, true]) {
		for (const required of [false, true]) {
			for (const value of [
				{ label: "empty", value: {} },
				{
					label: "[value1,value3]",
					value: { "form_value.0": "foo", "form_value.1": "baz" },
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
	label: "Tags",
	name: "tags",
};

test("change and submit correct value", async ({ page }) => {
	await page.goto(makeUrl({}));

	// submit initially empty

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			tags: [],
		});
	}

	// change

	await addTagsValue(page, fieldOptions, "custom");

	{
		const tagsValue = await getTagsValue(page, fieldOptions);
		expect(tagsValue).toEqual(["custom"]);
	}

	await selectTagsSuggestion(page, fieldOptions, "bar");

	{
		const tagsValue = await getTagsValue(page, fieldOptions);
		expect(tagsValue).toEqual(["custom", "bar"]);
	}

	// submit changed

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			tags: ["custom", "bar"],
		});
	}

	// clean

	await removeTagsChip(page, fieldOptions, "custom");
	await removeTagsChip(page, fieldOptions, "bar");

	{
		const tagsValue = await getTagsValue(page, fieldOptions);
		expect(tagsValue).toEqual([]);
	}

	// submit empty

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			tags: [],
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
		await expect(getFieldError(getTagsWrapper(page, fieldOptions))).toHaveText(
			"This field is required",
		);

		// set a correct value and submit agait
		await selectTagsSuggestion(page, fieldOptions, "foo");

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getTagsWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				tags: ["foo"],
			});
		}
	});
});
