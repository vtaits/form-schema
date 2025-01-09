import { expect, test } from "@playwright/test";
import { getSubmitButton, parseSubmitValues } from "tests/utils/formExample";
import { createMakeUrl } from "tests/utils/makeUrl";

const makeUrl = createMakeUrl("react-hook-form-schema--redefine-render-story");

test("init, change and submit", async ({ page }) => {
	await page.goto(makeUrl({}));

	const firstLabel = page.locator("div > p").filter({
		has: page.getByText("First name"),
	});

	const firstInput = firstLabel.locator("..").locator("input");

	const lastLabel = page.locator("fieldset > legend").filter({
		has: page.getByText("Last name"),
	});

	const lastInput = lastLabel.locator("..").locator("textarea");

	// check if the first name field rendered inside `div`
	await expect(firstLabel).toBeVisible();
	await expect(firstInput).toHaveValue("");

	// check if the last name field rendered inside `fieldset`
	await expect(lastLabel).toBeVisible();
	await expect(lastInput).toHaveValue("");

	// change fields
	await firstInput.fill("First");
	await lastInput.fill("Last");

	// submit
	await getSubmitButton(page).click();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			firstName: "First",
			lastName: "Last",
		});
	}
});
