import path from "node:path";
import { expect, test } from "@playwright/test";
import {
	getFieldError,
	getFileInputWrapper,
	getSelectedFileName,
	removeFile,
	selectFile,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import {
	getResult,
	getSubmitButton,
	parseSubmitValues,
} from "tests/utils/formExample";
import { createMakeUrl } from "tests/utils/makeUrl";

const makeUrl = createMakeUrl("react-form-schema-ui-mui-fields--file-story");

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
	label: "File",
	name: "file",
};

test.describe("change and submit correct value", () => {
	test("initial empty", async ({ page }) => {
		await page.goto(makeUrl({}));

		await expect(getSelectedFileName(page, fieldOptions)).not.toBeVisible();

		// submit initially null

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				file: null,
			});
		}

		// change

		await selectFile(page, fieldOptions, path.join(__dirname, "test.txt"));

		await expect(getSelectedFileName(page, fieldOptions)).toHaveText(
			"test.txt",
		);

		// submit changed

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				file: "test.txt",
			});
		}

		// clear

		await removeFile(page, fieldOptions);

		await expect(getSelectedFileName(page, fieldOptions)).not.toBeVisible();

		// submit empty

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				file: null,
			});
		}
	});

	test("initial filled", async ({ page }) => {
		await page.goto(
			makeUrl({
				form_value: "test",
			}),
		);

		await expect(getSelectedFileName(page, fieldOptions)).not.toBeVisible();

		// submit initially empty

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({});
		}

		// change

		await selectFile(page, fieldOptions, path.join(__dirname, "test.txt"));

		await expect(getSelectedFileName(page, fieldOptions)).toHaveText(
			"test.txt",
		);

		// submit changed

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				file: "test.txt",
			});
		}

		// clear

		await removeFile(page, fieldOptions);

		await expect(getSelectedFileName(page, fieldOptions)).not.toBeVisible();

		// submit empty

		await getSubmitButton(page).click();

		await expect(getSubmitButton(page)).toBeEnabled();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				file: null,
			});
		}
	});
});

test.fixme("accept", () => {});

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
		await expect(
			getFieldError(getFileInputWrapper(page, fieldOptions)),
		).toHaveText("This field is required");

		// set a correct value and submit agait
		await selectFile(page, fieldOptions, path.join(__dirname, "test.txt"));

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getFileInputWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				file: "test.txt",
			});
		}
	});

	test("minSize", async ({ page }) => {
		await page.goto(
			makeUrl({
				min_size: "5",
			}),
		);

		await selectFile(
			page,
			fieldOptions,
			path.join(__dirname, "test4bytes.txt"),
		);

		await getSubmitButton(page).click();

		// default html form validation
		await expect(getResult(page)).not.toBeVisible();
		await expect(
			getFieldError(getFileInputWrapper(page, fieldOptions)),
		).toHaveText("The size of this file must not be less than 5 bytes");

		// set a correct value and submit agait
		await selectFile(
			page,
			fieldOptions,
			path.join(__dirname, "test8bytes.txt"),
		);

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getFileInputWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				file: "test8bytes.txt",
			});
		}
	});

	test("maxSize", async ({ page }) => {
		await page.goto(
			makeUrl({
				max_size: "5",
			}),
		);

		await selectFile(
			page,
			fieldOptions,
			path.join(__dirname, "test8bytes.txt"),
		);

		await getSubmitButton(page).click();

		// default html form validation
		await expect(getResult(page)).not.toBeVisible();
		await expect(
			getFieldError(getFileInputWrapper(page, fieldOptions)),
		).toHaveText("The size of this file must no exceed 5 bytes");

		// set a correct value and submit agait
		await selectFile(
			page,
			fieldOptions,
			path.join(__dirname, "test4bytes.txt"),
		);

		await getSubmitButton(page).click();

		await expect(
			getFieldError(getFileInputWrapper(page, fieldOptions)),
		).not.toBeVisible();

		{
			const res = await parseSubmitValues(page);

			expect(res).toEqual({
				file: "test4bytes.txt",
			});
		}
	});
});
