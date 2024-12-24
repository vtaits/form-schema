import path from "node:path";
import { expect, test } from "@playwright/test";
import {
	addListBlock,
	addTagsValue,
	getCheckboxInput,
	getCheckboxWrapper,
	getFieldError,
	getFileInput,
	getFormError,
	getInput,
	getInputWithSuggestionsWrapper,
	getInputWrapper,
	getListRoot,
	getRadioInput,
	getSelect,
	getSelectText,
	getSelectWrapper,
	getTags,
	getTagsWrapper,
	getTextarea,
	getTextareaWrapper,
	removeListBlock,
	selectFile,
	selectInputSuggestion,
	selectMulipleValue,
	selectTagsSuggestion,
	selectValue,
	setInputValue,
	setTextareaValue,
	toggleCheckbox,
	toggleRadio,
} from "@vtaits/react-form-schema-ui-mui-playwright";
import { getSubmitButton, parseSubmitValues } from "./utils";

test.beforeEach(async ({ page }) => {
	await page.goto(
		"http://localhost:6006/iframe.html?id=react-form-schema-ui-mui--simple-story",
	);
});

test("render fields", async ({ page }) => {
	const form = page.locator("form");

	await expect(
		getCheckboxInput(form, {
			name: "checkbox",
			label: "Checkbox",
		}),
	).toBeVisible();

	await expect(
		getCheckboxInput(form, {
			name: "checkboxGroup",
			label: "Label 1",
		}),
	).toBeVisible();
	await expect(
		getCheckboxInput(form, {
			name: "checkboxGroup",
			label: "Label 2",
		}),
	).toBeVisible();
	await expect(
		getCheckboxInput(form, {
			name: "checkboxGroup",
			label: "Label 3",
		}),
	).toBeVisible();

	await expect(
		getInput(form, {
			name: "date",
			label: "Date",
		}),
	).toBeVisible();
	await expect(
		getInput(form, {
			name: "datetime",
			label: "Datetime",
		}),
	).toBeVisible();
	await expect(
		getFileInput(form, {
			name: "file",
			label: "File",
		}),
	).toBeVisible();
	await expect(
		getInput(form, {
			name: "input",
			label: "Input",
		}),
	).toBeVisible();
	await expect(
		getInput(form, {
			name: "inputWithOptions",
			label: "Input with options",
		}),
	).toBeVisible();
	await expect(
		getInput(form, {
			name: "number",
			label: "Number",
		}),
	).toBeVisible();

	await expect(
		getListRoot(form, {
			name: "list",
			label: "List",
			exact: true,
		}),
	).toBeVisible();
	await expect(
		getListRoot(form, {
			name: "setList",
			label: "List of sets",
		}),
	).toBeVisible();

	await expect(
		getSelect(form, {
			name: "multiSelect",
			label: "Multi select",
		}),
	).toBeVisible();

	await expect(
		getRadioInput(form, {
			name: "radioGroup",
			label: "Label 1",
		}),
	).toBeVisible();
	await expect(
		getRadioInput(form, {
			name: "radioGroup",
			label: "Label 2",
		}),
	).toBeVisible();
	await expect(
		getRadioInput(form, {
			name: "radioGroup",
			label: "Label 3",
		}),
	).toBeVisible();

	await expect(
		getSelect(form, {
			name: "select",
			label: "Select",
		}),
	).toBeVisible();

	const selectText = await getSelectText(form, {
		name: "select",
		label: "Select",
	});
	expect(selectText).toBe("Select");

	await expect(
		getTags(form, {
			name: "tags",
			label: "Tags",
		}),
	).toBeVisible();
	await expect(
		getTextarea(form, {
			name: "textarea",
			label: "Textarea",
		}),
	).toBeVisible();

	await expect(getSubmitButton(page)).toBeEnabled();
});

test("submit filled form", async ({ page }) => {
	const form = page.locator("form");

	await toggleCheckbox(form, {
		name: "checkbox",
		label: "Checkbox",
	});

	await toggleCheckbox(form, {
		name: "checkboxGroup",
		label: "Label 1",
	});
	await toggleCheckbox(form, {
		name: "checkboxGroup",
		label: "Label 3",
	});

	await setInputValue(
		form,
		{
			name: "date",
			label: "Date",
		},
		"2020-10-05",
	);
	await setInputValue(
		form,
		{
			name: "datetime",
			label: "Datetime",
		},
		"2021-05-10 16:45",
	);

	await selectFile(
		form,
		{
			name: "file",
			label: "File",
		},
		path.join(__dirname, "test.txt"),
	);

	await setInputValue(
		form,
		{
			name: "input",
			label: "Input",
		},
		"inputValue",
	);
	await selectInputSuggestion(
		form,
		{
			name: "inputWithOptions",
			label: "Input with options",
		},
		"foo",
	);
	await setInputValue(
		form,
		{
			name: "number",
			label: "Number",
		},
		"100",
	);

	await addListBlock(form, {
		name: "list",
		label: "List",
		exact: true,
	});
	await addListBlock(form, {
		name: "list",
		label: "List",
		exact: true,
	});
	await addListBlock(form, {
		name: "list",
		label: "List",
		exact: true,
	});

	await expect(
		getInput(form, {
			name: "list.2",
			label: "Input",
		}),
	).toBeVisible();

	await setInputValue(
		form,
		{
			name: "list.0",
			label: "Input",
		},
		"List 0",
	);
	await setInputValue(
		form,
		{
			name: "list.1",
			label: "Input",
		},
		"List 1",
	);
	await setInputValue(
		form,
		{
			name: "list.2",
			label: "Input",
		},
		"List 2",
	);

	await removeListBlock(
		form,
		{
			name: "list",
			label: "List",
			exact: true,
		},
		1,
	);

	await addListBlock(form, {
		name: "setList",
		label: "List of sets",
	});
	await addListBlock(form, {
		name: "setList",
		label: "List of sets",
	});
	await addListBlock(form, {
		name: "setList",
		label: "List of sets",
	});

	await expect(
		getInput(form, {
			name: "setList.2.date",
			label: "Date",
		}),
	).toBeVisible();

	await toggleCheckbox(form, {
		name: "setList.0.checkbox",
		label: "Checkbox",
	});

	await setInputValue(
		form,
		{
			name: "setList.0.date",
			label: "Date",
		},
		"2020-08-01",
	);
	await setInputValue(
		form,
		{
			name: "setList.1.date",
			label: "Date",
		},
		"2020-08-02",
	);
	await setInputValue(
		form,
		{
			name: "setList.2.date",
			label: "Date",
		},
		"2020-08-03",
	);

	await removeListBlock(
		form,
		{
			name: "setList",
			label: "List of sets",
		},
		1,
	);

	await selectMulipleValue(
		form,
		{
			name: "multiSelect",
			label: "Multi select",
		},
		["Label 1", "Label 3"],
	);

	await toggleRadio(form, {
		name: "radioGroup",
		label: "Label 1",
	});
	await toggleRadio(form, {
		name: "radioGroup",
		label: "Label 3",
	});

	await selectValue(
		form,
		{
			name: "select",
			label: "Select",
		},
		"Label 2",
	);

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

	await setTextareaValue(
		form,
		{
			name: "textarea",
			label: "Textarea",
		},
		"textareaValue",
	);

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	const res = await parseSubmitValues(page);

	expect(res).toEqual({
		checkbox: true,
		checkboxGroup: ["value1", "value3"],
		date: "2020-10-05",
		datetime: "2021-05-10 16:45",
		file: "test.txt",
		input: "inputValue",
		inputWithOptions: "foo",
		list: ["List 0", "List 2"],
		multiSelect: ["value1", "value3"],
		number: 100,
		radioGroup: "value3",
		select: "value2",
		setList: [
			{
				checkbox: true,
				date: "2020-08-01",
			},
			{
				checkbox: false,
				date: "2020-08-03",
			},
		],
		tags: ["foo", "userPrint"],
		textarea: "textareaValue",
	});
});

test("show form errors", async ({ page }) => {
	const form = page.locator("form");

	await getSubmitButton(page).click();

	await expect(getSubmitButton(page)).toBeEnabled();

	for (const field of [
		getCheckboxWrapper(form, {
			name: "checkbox",
			label: "Checkbox",
		}),
		// "checkboxGroup",
		getInputWrapper(form, {
			name: "date",
			label: "Date",
		}),
		getInputWrapper(form, {
			name: "datetime",
			label: "Datetime",
		}),
		getInputWrapper(form, {
			name: "input",
			label: "Input",
		}),
		getInputWithSuggestionsWrapper(form, {
			name: "inputWithOptions",
			label: "Input with options",
		}),
		getInputWithSuggestionsWrapper(form, {
			name: "number",
			label: "Number",
		}),
		getListRoot(form, {
			name: "list",
			label: "List",
			exact: true,
		}),
		getListRoot(form, {
			name: "setList",
			label: "List of sets",
		}),
		getSelectWrapper(form, {
			name: "multiSelect",
			label: "Multi select",
		}),
		// "radioGroup",
		getSelectWrapper(form, {
			name: "select",
			label: "Select",
		}),
		getTagsWrapper(form, {
			name: "tags",
			label: "Tags",
		}),
		getTextareaWrapper(form, {
			name: "textarea",
			label: "Textarea",
		}),
	]) {
		await expect(getFieldError(field)).toHaveText("This field is required");
	}

	expect(getFormError(form)).toHaveText("There are errors in the form");
});
