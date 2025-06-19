import { waitFor } from "@testing-library/dom";
import { cleanup } from "@testing-library/react";
import {
	type AccessorParamsType,
	AccessorQueryType,
	create,
} from "react-integration-test-engine";
import { afterEach, expect, test } from "vitest";
import { changeInput } from "./testing/scenarios";
import { ValidateBeforeSubmit } from "./ValidateBeforeSubmit";

const animalRequiredField: AccessorParamsType = {
	query: AccessorQueryType.Text,
	parameters: ["Animal (required)"],
	mapper: (element) => element.parentNode as HTMLElement,
};

const animalNotRequiredField: AccessorParamsType = {
	query: AccessorQueryType.Text,
	parameters: ["Animal (not required)"],
	mapper: (element) => element.parentNode as HTMLElement,
};

const render = create(
	ValidateBeforeSubmit,
	{},
	{
		queries: {
			animalRequiredInput: {
				query: AccessorQueryType.QuerySelector,
				parameters: ["input"],
				parent: animalRequiredField,
			},

			animalRequiredError: {
				query: AccessorQueryType.QuerySelector,
				parameters: [
					"ul li",
					{
						waitForElementOptions: {
							timeout: 1500,
						},
					},
				],
				parent: animalRequiredField,
			},

			animalNotRequiredInput: {
				query: AccessorQueryType.QuerySelector,
				parameters: ["input"],
				parent: animalNotRequiredField,
			},

			animalNotRequiredError: {
				query: AccessorQueryType.QuerySelector,
				parameters: [
					"ul li",
					{
						waitForElementOptions: {
							timeout: 1500,
						},
					},
				],
				parent: animalNotRequiredField,
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
			changeAnimalRequired: ["animalRequiredInput", changeInput],
			changeAnimalNotRequired: ["animalNotRequiredInput", changeInput],
		},
	},
);

afterEach(() => {
	cleanup();
});

test("submit after correcting errors", async () => {
	const engine = render({});

	engine.fireEvent("submit");

	const animalRequiredError = await engine.accessors.animalRequiredError.find();

	expect(animalRequiredError.textContent).toBe("This field is required");
	expect(engine.accessors.animalNotRequiredError.query()).toBeFalsy();

	await engine.run("changeAnimalRequired", "foo");

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
  "animalRequired": "foo",
  "animalNotRequired": ""
}`);

	expect(engine.accessors.animalRequiredError.query()).toBeFalsy();
	expect(engine.accessors.animalNotRequiredError.query()).toBeFalsy();
});
