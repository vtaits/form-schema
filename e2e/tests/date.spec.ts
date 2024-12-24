import { expect, test } from "@playwright/test";
import {
	getInput,
	setInputValue,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import { getSubmitButton, parseSubmitValues } from "./utils";

const BASE_URL =
	"http://127.0.0.1:6006/iframe.html?id=react-form-schema-ui-mui-fields--date-story";

test.describe("screenshots", () => {
	for (const disabled of [false, true]) {
		for (const required of [false, true]) {
			for (const value of ["", "2020-10-05"]) {
				const paramsStr = `disabled=${disabled},required=${required},value=${value}`;

				test(paramsStr, async ({ page }) => {
					await page.goto(
						`${BASE_URL}&args=${encodeURIComponent(`disabled:!${disabled};required:!${required};formValue:!${value}`)}`,
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
	label: "Date",
};

test.describe("change and submit correct value", () => {
	const formatCases = [
		{
			value: "2020-10-05",
			format: "",
		},

		{
			value: "2020-10-05",
			format: "yyyy-MM-dd",
		},

		{
			value: "05.10.2020",
			format: "dd.MM.yyyy",
		},
	];

	for (const serverCase of formatCases) {
		for (const clientCase of formatCases) {
			test(`server value = ${serverCase.value}, server format = ${serverCase.format}, client value = ${clientCase.value}, client format = ${clientCase.format}`, async ({
				page,
			}) => {
				await page.goto(
					`${BASE_URL}&args=${encodeURIComponent(`serverDateFormat:!${serverCase.format};displayDateFormat:!${clientCase.format}`)}`,
				);

				// submit initially empty

				await getSubmitButton(page).click();

				await expect(getSubmitButton(page)).toBeEnabled();

				{
					const res = await parseSubmitValues(page);

					expect(res).toEqual({
						date: null,
					});
				}

				// set value

				await setInputValue(page, fieldOptions, clientCase.value);

				await expect(getInput(page, fieldOptions)).toHaveValue(
					clientCase.value,
				);

				// submit changed

				await getSubmitButton(page).click();

				await expect(getSubmitButton(page)).toBeEnabled();

				{
					const res = await parseSubmitValues(page);

					expect(res).toEqual({
						date: serverCase.value,
					});
				}

				// clean

				await setInputValue(page, fieldOptions, "");

				await expect(getInput(page, fieldOptions)).toHaveValue("");

				// submit empty

				await getSubmitButton(page).click();

				await expect(getSubmitButton(page)).toBeEnabled();

				{
					const res = await parseSubmitValues(page);

					expect(res).toEqual({
						date: null,
					});
				}
			});
		}
	}
});
