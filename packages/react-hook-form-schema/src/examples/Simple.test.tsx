import { cleanup, waitFor } from "@testing-library/react";
import {
	AccessorParamsType,
	AccessorQueryType,
	create,
} from "react-integration-test-engine";
import { afterEach, expect, test } from "vitest";
import { Simple } from "./Simple";
import { changeInput } from "./testing/scenarios";

const firstNameField: AccessorParamsType = {
	query: AccessorQueryType.Text,
	parameters: ["First name"],
	mapper: (element) => element.parentNode as HTMLElement,
};

const lastNameField: AccessorParamsType = {
	query: AccessorQueryType.Text,
	parameters: ["Last name"],
	mapper: (element) => element.parentNode as HTMLElement,
};

const render = create(
	Simple,
	{},
	{
		queries: {
			firstNameInput: {
				query: AccessorQueryType.QuerySelector,
				parameters: ["input"],
				parent: firstNameField,
			},

			firstNameError: {
				query: AccessorQueryType.QuerySelector,
				parameters: [
					"ul li",
					{
						waitForElementOptions: {
							timeout: 1500,
						},
					},
				],
				parent: firstNameField,
			},

			lastNameInput: {
				query: AccessorQueryType.QuerySelector,
				parameters: ["input"],
				parent: lastNameField,
			},

			lastNameError: {
				query: AccessorQueryType.QuerySelector,
				parameters: [
					"ul li",
					{
						waitForElementOptions: {
							timeout: 1500,
						},
					},
				],
				parent: lastNameField,
			},

			submitButton: {
				query: AccessorQueryType.QuerySelector,
				parameters: ["button"],
			},

			submitResult: {
				query: AccessorQueryType.Text,
				parameters: ["Submitted values:"],
				mapper: (element) => element.nextElementSibling as HTMLElement,
			},
		},

		fireEvents: {
			submit: ["submitButton", "click"],
		},

		scenarios: {
			changeFirstName: ["firstNameInput", changeInput],
			changeLastName: ["lastNameInput", changeInput],
		},
	},
);

afterEach(() => {
	cleanup();
});

test("submit successfully", async () => {
	const engine = render({});

	await engine.run("changeFirstName", "foo");
	await engine.run("changeLastName", "bar");

	engine.fireEvent("submit");

	const submitResult = await engine.accessors.submitResult.find();

	expect(submitResult.textContent).toBe(`{
  "firstName": "foo",
  "lastName": "bar"
}`);
});

test("submit after correcting errors", async () => {
	const engine = render({});

	engine.fireEvent("submit");

	const firstNameError = await engine.accessors.firstNameError.find();
	const lastNameError = await engine.accessors.lastNameError.find();

	expect(firstNameError.textContent).toBe("This field is required");
	expect(lastNameError.textContent).toBe("This field is required");

	await engine.run("changeFirstName", "foo");
	await engine.run("changeLastName", "bar");

	engine.fireEvent("submit");

	await waitFor(
		() => {
			engine.accessors.submitResult.get();
		},
		{
			timeout: 1500,
		},
	);

	const submitResult = await engine.accessors.submitResult.find();

	expect(submitResult.textContent).toBe(`{
  "firstName": "foo",
  "lastName": "bar"
}`);
});
