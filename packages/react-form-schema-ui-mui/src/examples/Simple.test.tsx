import { cleanup, waitFor } from "@testing-library/react";
import {
	addListBlock,
	addTagsValue,
	queryCheckbox,
	queryFieldError,
	queryFormError,
	queryInput,
	queryListRoot,
	queryRadio,
	querySelect,
	queryTags,
	queryTextarea,
	removeListBlock,
	selectTagsSuggestion,
	selectValue,
	setInputValue,
	setTextareaValue,
	toggleCheckbox,
	toggleRadio,
} from "@vtaits/react-form-schema-ui-mui-testing-library";
import { AccessorQueryType, create } from "react-integration-test-engine";
import { afterEach, expect, test } from "vitest";
import { MuiProvider } from "../MuiProvider";
import { Simple } from "./Simple";

const render = create(
	Simple,
	{},
	{
		queries: {
			form: {
				query: AccessorQueryType.QuerySelector,
				parameters: ["form"],
			},
			submitButton: {
				query: AccessorQueryType.Text,
				parameters: ["Submit"],
			},
			result: {
				query: AccessorQueryType.QuerySelector,
				parameters: ["pre"],
			},
		},

		wrappers: {
			MuiProvider: (children) => [
				<MuiProvider key="mui">{children}</MuiProvider>,
				null,
			],
		},

		wrapperDefaultParams: {
			MuiProvider: undefined,
		},

		fireEvents: {
			submit: ["submitButton", "click"],
		},
	},
);

afterEach(() => {
	cleanup();
});

test("render fields", () => {
	const engine = render({});

	const form = engine.accessors.form.get();

	expect(queryCheckbox(form, "checkbox", "Checkbox")).toBeTruthy();

	expect(queryCheckbox(form, "checkboxGroup", "Label 1")).toBeTruthy();
	expect(queryCheckbox(form, "checkboxGroup", "Label 2")).toBeTruthy();
	expect(queryCheckbox(form, "checkboxGroup", "Label 3")).toBeTruthy();

	expect(queryInput(form, "date")).toBeTruthy();
	expect(queryInput(form, "datetime")).toBeTruthy();
	expect(queryInput(form, "input")).toBeTruthy();
	expect(queryInput(form, "number")).toBeTruthy();

	expect(queryListRoot(form, "list")).toBeTruthy();
	expect(queryListRoot(form, "setList")).toBeTruthy();

	expect(querySelect(form, "multiSelect", "Multi select")).toBeTruthy();

	expect(queryRadio(form, "radioGroup", "Label 1")).toBeTruthy();
	expect(queryRadio(form, "radioGroup", "Label 2")).toBeTruthy();
	expect(queryRadio(form, "radioGroup", "Label 3")).toBeTruthy();

	expect(querySelect(form, "select", "Select")).toBeTruthy();
	expect(queryTags(form, "tags", "Tags")).toBeTruthy();
	expect(queryTextarea(form, "textarea", "Textarea")).toBeTruthy();

	expect(engine.accessors.submitButton.get()).toHaveProperty("disabled", false);
});

test("submit filled form", async () => {
	const engine = render({});

	const form = engine.accessors.form.get();

	toggleCheckbox(form, "checkbox", "Checkbox");

	toggleCheckbox(form, "checkboxGroup", "Label 1");
	toggleCheckbox(form, "checkboxGroup", "Label 3");

	setInputValue(form, "date", null, "2020-10-05");
	setInputValue(form, "datetime", null, "2021-05-10 16:45");
	setInputValue(form, "input", "Input", "inputValue");
	setInputValue(form, "number", "Number", "100");

	addListBlock(form, "list");
	addListBlock(form, "list");
	addListBlock(form, "list");

	await waitFor(() => {
		expect(queryInput(form, "list.2", "Input")).toBeTruthy();
	});

	setInputValue(form, "list.0", "Input", "List 0");
	setInputValue(form, "list.1", "Input", "List 1");
	setInputValue(form, "list.2", "Input", "List 2");

	removeListBlock(form, "list", 1);

	addListBlock(form, "setList");
	addListBlock(form, "setList");
	addListBlock(form, "setList");

	await waitFor(() => {
		expect(queryInput(form, "setList.2.date", "Date")).toBeTruthy();
	});

	toggleCheckbox(form, "setList.0.checkbox", "Checkbox");
	setInputValue(form, "setList.0.date", "Date", "2020-08-01");
	setInputValue(form, "setList.1.date", "Date", "2020-08-02");
	setInputValue(form, "setList.2.date", "Date", "2020-08-03");

	removeListBlock(form, "setList", 1);

	await selectValue(form, "multiSelect", "Multi select", "Label 1");
	await selectValue(form, "multiSelect", "Multi select", "Label 3");

	toggleRadio(form, "radioGroup", "Label 1");
	toggleRadio(form, "radioGroup", "Label 3");

	await selectValue(form, "select", "Select", "Label 2");

	await selectTagsSuggestion(form, "tags", "Tags", "foo");
	addTagsValue(form, "tags", "Tags", "userPrint");

	setTextareaValue(form, "textarea", "Textarea", "textareaValue");

	engine.fireEvent("submit");

	await waitFor(() => {
		expect(engine.accessors.submitButton.get()).toHaveProperty(
			"disabled",
			false,
		);
	});

	expect(JSON.parse(engine.accessors.result.get().textContent || "")).toEqual({
		checkbox: true,
		checkboxGroup: ["value1", "value3"],
		date: "2020-10-05",
		datetime: "2021-05-10 16:45",
		input: "inputValue",
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

test("show form errors", async () => {
	const engine = render({});

	const form = engine.accessors.form.get();

	engine.fireEvent("submit");

	await waitFor(() => {
		expect(engine.accessors.submitButton.get()).toHaveProperty(
			"disabled",
			false,
		);
		expect(queryFieldError(form, "checkbox")).toHaveProperty(
			"textContent",
			"This field is required",
		);
	});

	for (const fieldName of [
		"checkbox",
		"checkboxGroup",
		"date",
		"datetime",
		"input",
		"number",
		"list",
		"setList",
		"multiSelect",
		"radioGroup",
		"select",
		"tags",
		"textarea",
	]) {
		expect(queryFieldError(form, fieldName)).toHaveProperty(
			"textContent",
			"This field is required",
		);
	}

	expect(queryFormError(form)).toHaveProperty(
		"textContent",
		"There are errors in the form",
	);
});
