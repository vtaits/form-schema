import { expect, test } from "@playwright/test";
import {
	addListBlock,
	getFieldError,
	getInput,
	getListBlock,
	getListBlockTitle,
	getListRoot,
	removeListBlock,
	setInputValue,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import exp = require("node:constants");
import {
	getResult,
	getSubmitButton,
	parseSubmitValues,
} from "tests/utils/formExample";
import { createMakeUrl } from "tests/utils/makeUrl";

const makeUrl = createMakeUrl(
	"react-form-schema-ui-mui-fields--simple-list-story",
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
	label: "List",
	name: "list",
};

const inputOptions = {
	label: "Input",
};

test.describe("change and submit correct value", () => {
	const testCases = [
		// '',
		"testInitial",
	];

	for (const testCase of testCases) {
		test(`initialItem = ${testCase}`, async ({ page }) => {
			await page.goto(
				makeUrl({
					initial_item: testCase,
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

			await expect(getInput(listBlock1, inputOptions)).toHaveValue(testCase);
			await setInputValue(listBlock1, inputOptions, "test1");

			await addListBlock(page, fieldOptions);

			await expect(getListBlockTitle(listBlock1)).toHaveText("Block #1");
			await expect(getListBlockTitle(listBlock2)).toHaveText("Block #2");

			await expect(getInput(listBlock2, inputOptions)).toHaveValue(testCase);

			// submit changed

			await getSubmitButton(page).click();

			await expect(getSubmitButton(page)).toBeEnabled();

			{
				const res = await parseSubmitValues(page);

				expect(res).toEqual({
					list: ["test1", testCase],
				});
			}

			// changed

			await removeListBlock(page, fieldOptions, 0);

			await expect(getListBlockTitle(listBlock1)).toHaveText("Block #1");
			await expect(getListBlockTitle(listBlock2)).not.toBeVisible();

			await expect(getInput(listBlock1, inputOptions)).toHaveValue(testCase);

			// submit changed

			await getSubmitButton(page).click();

			await expect(getSubmitButton(page)).toBeEnabled();

			{
				const res = await parseSubmitValues(page);

				expect(res).toEqual({
					list: [testCase],
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
				list: [""],
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

		await setInputValue(listBlock1, inputOptions, "test1");

		await getSubmitButton(page).click();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				list: ["test1"],
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
		const listBlock1 = getListBlock(page, fieldOptions, 0);
		const listBlock2 = getListBlock(page, fieldOptions, 1);

		await setInputValue(listBlock1, inputOptions, "test1");

		await addListBlock(page, fieldOptions);

		await setInputValue(listBlock2, inputOptions, "test2");

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getListRoot(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				list: ["test1", "test2"],
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

		await setInputValue(listBlock1, inputOptions, "test1");

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
				list: ["test1"],
			});
		}
	});
});
