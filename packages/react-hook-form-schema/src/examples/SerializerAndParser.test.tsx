import { waitFor } from "@testing-library/dom";
import { cleanup } from "@testing-library/react";
import {
	type AccessorParamsType,
	AccessorQueryType,
	create,
} from "react-integration-test-engine";
import { afterEach, expect, test } from "vitest";
import { SerializerAndParser } from "./SerializerAndParser";
import { getSelectText } from "./testing/mappers";
import { changeInput, clearSelect } from "./testing/scenarios";

const animalField: AccessorParamsType = {
	query: AccessorQueryType.Text,
	parameters: ["Animal"],
	mapper: (element) => element.parentNode as HTMLElement,
};

const render = create(
	SerializerAndParser,
	{},
	{
		queries: {
			animalField,

			animalText: {
				query: AccessorQueryType.Text,
				parameters: ["Animal"],
				mapper: getSelectText,
			},

			animalError: {
				query: AccessorQueryType.QuerySelector,
				parameters: [
					"ul li",
					{
						waitForElementOptions: {
							timeout: 1500,
						},
					},
				],
				parent: animalField,
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
			changeAnimal: ["animalText", changeInput],
			clearAnimal: ["animalField", clearSelect],
		},
	},
);

afterEach(() => {
	cleanup();
});

test("render with default values", async () => {
	const engine = render({});

	await waitFor(() => {
		expect(engine.accessors.animalText.get()).toHaveProperty(
			"textContent",
			"Dog",
		);
	});
});

test("submit without change", async () => {
	const engine = render({});

	await waitFor(() => {
		expect(engine.accessors.animalText.get()).toHaveProperty(
			"textContent",
			"Dog",
		);
	});

	engine.fireEvent("submit");

	const submitResult = await engine.accessors.submitResult.find();

	expect(submitResult.textContent).toBe(`{
  "animal": 2
}`);
});

test("submit empty field", async () => {
	const engine = render({});

	await waitFor(() => {
		expect(engine.accessors.animalText.get()).toHaveProperty(
			"textContent",
			"Dog",
		);
	});

	await engine.run("clearAnimal");

	engine.fireEvent("submit");

	const submitResult = await engine.accessors.submitResult.find();

	expect(submitResult.textContent).toBe(`{
  "animal": null
}`);
});
