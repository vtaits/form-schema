import { cleanup, waitFor } from "@testing-library/react";
import {
	addTagsValue,
	getSelectText,
	getTagsValue,
	queryCheckbox,
	queryInput,
	queryRadio,
	queryTextarea,
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
import { OnChangeExample } from "./OnChange";

const render = create(
	OnChangeExample,
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

test("submit filled form", async () => {
	const engine = render({});

	const form = engine.accessors.form.get();

	toggleCheckbox(form, "checkbox", "Checkbox");
	expect(queryCheckbox(form, "checkbox_cloned", "Checkbox")).toHaveProperty(
		"checked",
		true,
	);

	toggleCheckbox(form, "checkboxGroup", "Label 1");
	toggleCheckbox(form, "checkboxGroup", "Label 3");
	expect(queryCheckbox(form, "checkboxGroup_cloned", "Label 1")).toHaveProperty(
		"checked",
		true,
	);
	expect(queryCheckbox(form, "checkboxGroup_cloned", "Label 2")).toHaveProperty(
		"checked",
		false,
	);
	expect(queryCheckbox(form, "checkboxGroup_cloned", "Label 3")).toHaveProperty(
		"checked",
		true,
	);

	await setInputValue(form, "date", null, "2020-10-05");
	expect(queryInput(form, "date_cloned", null)).toHaveProperty(
		"value",
		"2020-10-05",
	);

	await setInputValue(form, "datetime", null, "2021-05-10 16:45");
	expect(queryInput(form, "datetime_cloned", null)).toHaveProperty(
		"value",
		"2021-05-10 16:45",
	);

	await setInputValue(form, "input", "Input", "inputValue");
	expect(queryInput(form, "input_cloned", "Input")).toHaveProperty(
		"value",
		"inputValue",
	);

	await setInputValue(form, "number", "Number", "100");
	expect(queryInput(form, "number_cloned", "Number")).toHaveProperty(
		"value",
		"100",
	);

	await selectValue(form, "multiSelect", "Multi select", "Label 1");
	await selectValue(form, "multiSelect", "Multi select", "Label 3");
	expect(getSelectText(form, "multiSelect_cloned", "Multi select")).toBe(
		"Label 1, Label 3",
	);

	toggleRadio(form, "radioGroup", "Label 1");
	toggleRadio(form, "radioGroup", "Label 3");
	expect(queryRadio(form, "radioGroup_cloned", "Label 3")).toHaveProperty(
		"checked",
		true,
	);

	await selectValue(form, "select", "Select", "Label 2");
	expect(getSelectText(form, "select_cloned", "Select")).toBe("Label 2");

	await selectTagsSuggestion(form, "tags", "Tags", "foo");
	addTagsValue(form, "tags", "Tags", "userPrint");
	expect(getTagsValue(form, "tags_cloned", "Tags")).toEqual([
		"foo",
		"userPrint",
	]);

	setTextareaValue(form, "textarea", "Textarea", "textareaValue");
	expect(queryTextarea(form, "textarea_cloned", "Textarea")).toHaveProperty(
		"value",
		"textareaValue",
	);

	engine.fireEvent("submit");

	await waitFor(() => {
		expect(engine.accessors.submitButton.get()).toHaveProperty(
			"disabled",
			false,
		);
	});

	expect(JSON.parse(engine.accessors.result.get().textContent || "")).toEqual({
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
