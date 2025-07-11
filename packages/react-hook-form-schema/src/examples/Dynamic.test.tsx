import { cleanup } from "@testing-library/react";
import { AccessorQueryType, create } from "react-integration-test-engine";
import { afterEach, expect, test } from "vitest";
import { Dynamic } from "./Dynamic";
import { changeInput } from "./testing/scenarios";

const render = create(
	Dynamic,
	{},
	{
		queries: {
			firstNameInput: {
				query: AccessorQueryType.QuerySelector,
				parameters: ['[name="firstName"]'],
			},

			lastNameInput: {
				query: AccessorQueryType.QuerySelector,
				parameters: ['[name="lastName"]'],
			},

			wowInput: {
				query: AccessorQueryType.QuerySelector,
				parameters: ['[name="wow"]'],
			},

			owoInput: {
				query: AccessorQueryType.QuerySelector,
				parameters: ['[name="owo"]'],
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
			submit: ["submitButton", "submit"],
		},

		scenarios: {
			changeFirstName: ["firstNameInput", changeInput],
			changeLastName: ["lastNameInput", changeInput],
			changeWow: ["wowInput", changeInput],
			changeOwo: ["owoInput", changeInput],
		},
	},
);

afterEach(() => {
	cleanup();
});

test("submit empty form", async () => {
	const engine = render({});

	expect(engine.accessors.wowInput.query()).toBeFalsy();

	engine.fireEvent("submit");

	const submitResult = await engine.accessors.submitResult.find();

	expect(submitResult.textContent).toBe(`{
  "firstName": "",
  "lastName": ""
}`);
});

test("submit filled form", async () => {
	const engine = render({});

	await engine.run("changeFirstName", "foo");
	await engine.run("changeLastName", "bar");
	await engine.run("changeWow", "baz");
	await engine.run("changeOwo", "quux");

	engine.fireEvent("submit");

	const submitResult = await engine.accessors.submitResult.find();

	expect(submitResult.textContent).toBe(`{
  "firstName": "foo",
  "lastName": "bar",
  "wow": "baz",
  "owo": "quux"
}`);
});
