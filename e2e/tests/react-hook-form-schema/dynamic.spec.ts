import { expect, test } from "@playwright/test";
import { getSubmitButton, parseSubmitValues } from "tests/utils/formExample";
import { createMakeUrl } from "tests/utils/makeUrl";

const makeUrl = createMakeUrl("react-hook-form-schema--dynamic-story");

test("parse initial value correctly", async ({ page }) => {
	await page.goto(
		makeUrl({
			"default_values.firstName": "First",
			"default_values.lastName": "Last",
			"default_values.wow": "WOW",
			"default_values.owo": "OWO",
		}),
	);

	// check values of the fields
	await expect(page.locator('input[name="firstName"]')).toHaveValue("First");
	await expect(page.locator('input[name="lastName"]')).toHaveValue("Last");
	await expect(page.locator('input[name="wow"]')).toHaveValue("WOW");
	await expect(page.locator('input[name="owo"]')).toHaveValue("OWO");

	// submit
	await getSubmitButton(page).click();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			firstName: "First",
			lastName: "Last",
			wow: "WOW",
			owo: "OWO",
		});
	}
});

test("change and submit", async ({ page }) => {
	await page.goto(makeUrl({}));

	// check initial render
	await expect(page.locator('input[name="firstName"]')).toHaveValue("");
	await expect(page.locator('input[name="lastName"]')).toHaveValue("");
	await expect(page.locator('input[name="wow"]')).not.toBeVisible();
	await expect(page.locator('input[name="owo"]')).not.toBeVisible();
	await expect(page.getByText("INPUT YOUR FIRST NAME FIRST!!!")).toBeVisible();

	await getSubmitButton(page).click();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			firstName: "",
			lastName: "",
		});
	}

	// change only the label of the last name field
	await page.locator('input[name="firstName"]').fill("Alex");

	await expect(page.locator('input[name="firstName"]')).toHaveValue("Alex");
	await expect(page.locator('input[name="lastName"]')).toHaveValue("");
	await expect(page.locator('input[name="wow"]')).not.toBeVisible();
	await expect(page.locator('input[name="owo"]')).not.toBeVisible();
	await expect(page.getByText("Last name of Alex")).toBeVisible();

	await getSubmitButton(page).click();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			firstName: "Alex",
			lastName: "",
		});
	}

	// show all the fields
	await page.locator('input[name="lastName"]').fill("Some");

	await expect(page.locator('input[name="firstName"]')).toHaveValue("Alex");
	await expect(page.locator('input[name="lastName"]')).toHaveValue("Some");
	await expect(page.locator('input[name="wow"]')).toHaveValue("");
	await expect(page.locator('input[name="owo"]')).toHaveValue("");
	await expect(page.getByText("Last name of Alex")).toBeVisible();

	await getSubmitButton(page).click();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			firstName: "Alex",
			lastName: "Some",
			wow: "",
			owo: "",
		});
	}

	// change all the fields
	await page.locator('input[name="wow"]').fill("WOW");
	await page.locator('input[name="owo"]').fill("OWO");

	await expect(page.locator('input[name="firstName"]')).toHaveValue("Alex");
	await expect(page.locator('input[name="lastName"]')).toHaveValue("Some");
	await expect(page.locator('input[name="wow"]')).toHaveValue("WOW");
	await expect(page.locator('input[name="owo"]')).toHaveValue("OWO");
	await expect(page.getByText("Last name of Alex")).toBeVisible();

	await getSubmitButton(page).click();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			firstName: "Alex",
			lastName: "Some",
			wow: "WOW",
			owo: "OWO",
		});
	}

	// clean the last name field
	await page.locator('input[name="lastName"]').fill("");

	await expect(page.locator('input[name="firstName"]')).toHaveValue("Alex");
	await expect(page.locator('input[name="lastName"]')).toHaveValue("");
	await expect(page.locator('input[name="wow"]')).not.toBeVisible();
	await expect(page.locator('input[name="owo"]')).not.toBeVisible();
	await expect(page.getByText("Last name of Alex")).toBeVisible();

	await getSubmitButton(page).click();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			firstName: "Alex",
			lastName: "",
		});
	}

	// clean the first name field
	await page.locator('input[name="firstName"]').fill("");

	await expect(page.locator('input[name="firstName"]')).toHaveValue("");
	await expect(page.locator('input[name="lastName"]')).toHaveValue("");
	await expect(page.locator('input[name="wow"]')).not.toBeVisible();
	await expect(page.locator('input[name="owo"]')).not.toBeVisible();
	await expect(page.getByText("INPUT YOUR FIRST NAME FIRST!!!")).toBeVisible();

	await getSubmitButton(page).click();

	{
		const res = await parseSubmitValues(page);

		expect(res).toEqual({
			firstName: "",
			lastName: "",
		});
	}
});
