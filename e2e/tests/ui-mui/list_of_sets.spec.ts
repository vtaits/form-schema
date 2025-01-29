import { expect, test } from "@playwright/test";
import {
	addListBlock,
	getCheckboxInput,
	getFieldError,
	getInput,
	getListBlock,
	getListBlockTitle,
	getListRoot,
	removeListBlock,
	setInputValue,
	toggleCheckbox,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import exp = require("node:constants");
import {
	getResult,
	getSubmitButton,
	parseSubmitValues,
} from "tests/utils/formExample";
import { createMakeUrl } from "tests/utils/makeUrl";

const makeUrl = createMakeUrl(
	"react-form-schema-ui-mui-fields--list-of-sets-story",
);

test.describe("screenshots", () => {
	for (const disabled of [false, true]) {
		for (const required of [false, true]) {
			for (const value of [
				{ label: "empty", value: {} },
				{
					label: "[2025-01-02,true;2025-02-20,false]",
					value: {
						"form_value[0].date": "2025-01-02",
						"form_value[0].checkbox": "!true",
						"form_value[1].date": "2025-02-20",
						"form_value[1].checkbox": "!false",
					},
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
	label: "List",
	name: "list",
};

const checkboxOptions = {
	label: "Checkbox",
};

const dateOptions = {
	label: "Date",
};

test.describe("change and submit correct value", () => {
	const testCases = [
		{
			label: "empty",
			urlValues: {},
			initialValues: {
				checkbox: false,
				date: "",
			},
		},
		{
			label: "filled",
			urlValues: {
				"initial_item.checkbox": "!true",
				"initial_item.date": "2020-05-13",
			},
			initialValues: {
				checkbox: true,
				date: "2020-05-13",
			},
		},
	];

	for (const testCase of testCases) {
		test(`initialItem = ${testCase.label}`, async ({ page }) => {
			await page.goto(
				makeUrl({
					...testCase.urlValues,
				}),
			);

			const listBlock1 = getListBlock(page, fieldOptions, 0);
			const listBlock2 = getListBlock(page, fieldOptions, 1);

			await expect(listBlock1).not.toBeVisible();

			// submit initially empty

			await getSubmitButton(page).click();

			await expect(getSubmitButton(page)).toBeEnabled();

			{
				const res = await parseSubmitValues(page);

				expect(res).toEqual({
					list: [],
				});
			}

			// change

			await addListBlock(page, fieldOptions);

			await expect(getListBlockTitle(listBlock1)).toHaveText("Block #1");
			await expect(listBlock2).not.toBeVisible();

			if (testCase.initialValues.checkbox) {
				await expect(
					getCheckboxInput(listBlock1, checkboxOptions),
				).toBeChecked();
			} else {
				await expect(
					getCheckboxInput(listBlock1, checkboxOptions),
				).not.toBeChecked();
			}

			await expect(getInput(listBlock1, dateOptions)).toHaveValue(
				testCase.initialValues.date,
			);

			await toggleCheckbox(listBlock1, checkboxOptions);

			await setInputValue(listBlock1, dateOptions, "2020-04-21");

			await addListBlock(page, fieldOptions);

			await expect(getListBlockTitle(listBlock1)).toHaveText("Block #1");
			await expect(getListBlockTitle(listBlock2)).toHaveText("Block #2");

			if (testCase.initialValues.checkbox) {
				await expect(
					getCheckboxInput(listBlock2, checkboxOptions),
				).toBeChecked();
			} else {
				await expect(
					getCheckboxInput(listBlock2, checkboxOptions),
				).not.toBeChecked();
			}

			await expect(getInput(listBlock2, dateOptions)).toHaveValue(
				testCase.initialValues.date,
			);

			// submit changed

			await getSubmitButton(page).click();

			await expect(getSubmitButton(page)).toBeEnabled();

			{
				const res = await parseSubmitValues(page);

				expect(res).toEqual({
					list: [
						{
							checkbox: !testCase.initialValues.checkbox,
							date: "2020-04-21",
						},
						{
							checkbox: testCase.initialValues.checkbox,
							date: testCase.initialValues.date || null,
						},
					],
				});
			}

			// changed

			await removeListBlock(page, fieldOptions, 1);

			await expect(getListBlockTitle(listBlock1)).toHaveText("Block #1");
			await expect(getListBlockTitle(listBlock2)).not.toBeVisible();

			// submit changed

			await getSubmitButton(page).click();

			await expect(getSubmitButton(page)).toBeEnabled();

			{
				const res = await parseSubmitValues(page);

				expect(res).toEqual({
					list: [
						{
							checkbox: !testCase.initialValues.checkbox,
							date: "2020-04-21",
						},
					],
				});
			}
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

		await expect(getFieldError(getListRoot(page, fieldOptions))).toHaveText(
			"This field is required",
		);

		// set a correct value and submit agait
		await addListBlock(page, fieldOptions);

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getListRoot(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				list: [
					{
						checkbox: false,
						date: null,
					},
				],
			});
		}
	});

	test("nested input required", async ({ page }) => {
		await page.goto(
			makeUrl({
				nested_field_required: "!true",
			}),
		);

		await addListBlock(page, fieldOptions);

		await getSubmitButton(page).click();

		// default html form validation
		await page.waitForTimeout(1000);

		await expect(getResult(page)).not.toBeVisible();

		// set a correct value and submit agait
		const listBlock1 = getListBlock(page, fieldOptions, 0);

		await setInputValue(listBlock1, dateOptions, "2025-05-25");

		await getSubmitButton(page).click();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				list: [
					{
						checkbox: false,
						date: "2025-05-25",
					},
				],
			});
		}
	});

	test("minLenght", async ({ page }) => {
		await page.goto(
			makeUrl({
				min_length: "2",
			}),
		);

		await addListBlock(page, fieldOptions);

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		await expect(getFieldError(getListRoot(page, fieldOptions))).toHaveText(
			"This field must contain at least 2 elements",
		);

		await expect(getResult(page)).not.toBeVisible();

		// set a correct value and submit agait
		await addListBlock(page, fieldOptions);

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getListRoot(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				list: [
					{
						checkbox: false,
						date: null,
					},
					{
						checkbox: false,
						date: null,
					},
				],
			});
		}
	});

	test("maxLenght", async ({ page }) => {
		await page.goto(
			makeUrl({
				max_length: "1",
			}),
		);

		const listBlock1 = getListBlock(page, fieldOptions, 0);

		await addListBlock(page, fieldOptions);
		await addListBlock(page, fieldOptions);

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		await expect(getFieldError(getListRoot(page, fieldOptions))).toHaveText(
			"This field must contain no more than 1 elements",
		);

		await expect(getResult(page)).not.toBeVisible();

		// set a correct value and submit agait
		await removeListBlock(page, fieldOptions, 1);

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getListRoot(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				list: [
					{
						checkbox: false,
						date: null,
					},
				],
			});
		}
	});
});
