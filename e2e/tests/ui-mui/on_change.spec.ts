import { expect, test } from "@playwright/test";
import {
	addTagsValue,
	getCheckboxInput,
	getInput,
	getRadioInput,
	getSelectText,
	getTagsValue,
	getTextarea,
	selectInputSuggestion,
	selectMulipleValue,
	selectTagsSuggestion,
	selectValue,
	setDateInputValue,
	setInputValue,
	setTextareaValue,
	toggleCheckbox,
	toggleRadio,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import { getSubmitButton, parseSubmitValues } from "../utils/formExample";

test.beforeEach(async ({ page }) => {
	await page.goto(
		"http://localhost:6006/iframe.html?id=react-form-schema-ui-mui--on-change-story",
	);
});

test("submit filled form", async ({ page }) => {
	const form = page.locator("form");

	await toggleCheckbox(form, {
		name: "checkbox",
		label: "Checkbox",
	});
	await expect(
		getCheckboxInput(form, {
			name: "checkbox_cloned",
			label: "Checkbox",
		}),
	).toBeChecked();

	await toggleCheckbox(form, {
		name: "checkboxGroup",
		label: "Label 1",
	});
	await toggleCheckbox(form, {
		name: "checkboxGroup",
		label: "Label 3",
	});
	await expect(
		getCheckboxInput(form, {
			name: "checkboxGroup_cloned",
			label: "Label 1",
		}),
	).toBeChecked();
	await expect(
		getCheckboxInput(form, {
			name: "checkboxGroup_cloned",
			label: "Label 2",
		}),
	).not.toBeChecked();
	await expect(
		getCheckboxInput(form, {
			name: "checkboxGroup_cloned",
			label: "Label 3",
		}),
	).toBeChecked();

	await setDateInputValue(
		form,
		{
			name: "date",
			label: "Date",
		},
		"2020-10-05",
	);
	await expect(
		getInput(form, {
			name: "date_cloned",
			label: "Date",
		}),
	).toHaveValue("2020-10-05");

	await setInputValue(
		form,
		{
			name: "datetime",
			label: "Datetime",
		},
		"2021-05-10 16:45",
	);
	expect(
		getInput(form, {
			name: "datetime_cloned",
			label: "Datetime",
		}),
	).toHaveValue("2021-05-10 16:45");

	await setInputValue(
		form,
		{
			name: "input",
			label: "Input",
		},
		"inputValue",
	);
	expect(
		getInput(form, {
			name: "input_cloned",
			label: "Input",
		}),
	).toHaveValue("inputValue");

	await selectInputSuggestion(
		form,
		{
			name: "inputWithOptions",
			label: "Input with options",
		},
		"foo",
	);
	expect(
		getInput(form, {
			name: "inputWithOptions_cloned",
			label: "Input with options",
		}),
	).toHaveValue("foo");

	await setInputValue(
		form,
		{
			name: "number",
			label: "Number",
		},
		"100",
	);
	expect(
		getInput(form, {
			name: "number_cloned",
			label: "Number",
		}),
	).toHaveValue("100");

	await selectMulipleValue(
		form,
		{
			name: "multiSelect",
			label: "Multi select",
		},
		["Label 1", "Label 3"],
	);

	const multiSelectText = await getSelectText(form, {
		name: "multiSelect_cloned",
		label: "Multi select",
	});
	expect(multiSelectText).toBe("Label 1, Label 3");

	await toggleRadio(form, {
		name: "radioGroup",
		label: "Label 1",
	});
	await toggleRadio(form, {
		name: "radioGroup",
		label: "Label 3",
	});
	expect(
		getRadioInput(form, {
			name: "radioGroup_cloned",
			label: "Label 3",
		}),
	).toBeChecked();

	await selectValue(
		form,
		{
			name: "select",
			label: "Select",
		},
		"Label 2",
	);
	const selectText = await getSelectText(form, {
		name: "select_cloned",
		label: "Select",
	});
	expect(selectText).toBe("Label 2");

	await selectTagsSuggestion(
		form,
		{
			name: "tags",
			label: "Tags",
		},
		"foo",
	);
	await addTagsValue(
		form,
		{
			name: "tags",
			label: "Tags",
		},
		"userPrint",
	);

	const tagsValue = await getTagsValue(form, {
		name: "tags_cloned",
		label: "Tags",
	});
	expect(tagsValue).toEqual(["foo", "userPrint"]);

	await setTextareaValue(
		form,
		{
			name: "textarea",
			label: "Textarea",
		},
		"textareaValue",
	);
	expect(
		getTextarea(form, {
			name: "textarea_cloned",
			label: "Textarea",
		}),
	).toHaveValue("textareaValue");

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	const res = await parseSubmitValues(page);

	expect(res).toEqual({
		checkbox: true,
		checkbox_cloned: true,
		checkboxGroup: ["value1", "value3"],
		checkboxGroup_cloned: ["value1", "value3"],
		date: "2020-10-05",
		date_cloned: "2020-10-05",
		datetime: "2021-05-10 16:45",
		datetime_cloned: "2021-05-10 16:45",
		input: "inputValue",
		input_cloned: "inputValue",
		inputWithOptions: "foo",
		inputWithOptions_cloned: "foo",
		multiSelect: ["value1", "value3"],
		multiSelect_cloned: ["value1", "value3"],
		number: 100,
		number_cloned: 100,
		radioGroup: "value3",
		radioGroup_cloned: "value3",
		select: "value2",
		select_cloned: "value2",
		tags: ["foo", "userPrint"],
		tags_cloned: ["foo", "userPrint"],
		textarea: "textareaValue",
		textarea_cloned: "textareaValue",
	});
});
