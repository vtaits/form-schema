import { waitFor } from "@testing-library/dom";
import { cleanup } from "@testing-library/react";
import {
	type AccessorParamsType,
	AccessorQueryType,
	create,
} from "react-integration-test-engine";
import { afterEach, expect, test } from "vitest";
import { FieldArray } from "./FieldArray";
import { changeInput } from "./testing/scenarios";

const block1: AccessorParamsType = {
	query: AccessorQueryType.TestId,
	parameters: ["users/0"],
};

const block2: AccessorParamsType = {
	query: AccessorQueryType.TestId,
	parameters: ["users/1"],
};

const block1Remove: AccessorParamsType = {
	query: AccessorQueryType.Text,
	parameters: ["Remove"],
	parent: block1,
};

const block2Remove: AccessorParamsType = {
	query: AccessorQueryType.Text,
	parameters: ["Remove"],
	parent: block2,
};

const firstName1Field: AccessorParamsType = {
	query: AccessorQueryType.Text,
	parameters: ["First name"],
	mapper: (element) => element.parentNode as HTMLElement,
	parent: block1,
};

const lastName1Field: AccessorParamsType = {
	query: AccessorQueryType.Text,
	parameters: ["Last name"],
	mapper: (element) => element.parentNode as HTMLElement,
	parent: block1,
};

const firstName2Field: AccessorParamsType = {
	query: AccessorQueryType.Text,
	parameters: ["First name"],
	mapper: (element) => element.parentNode as HTMLElement,
	parent: block2,
};

const lastName2Field: AccessorParamsType = {
	query: AccessorQueryType.Text,
	parameters: ["Last name"],
	mapper: (element) => element.parentNode as HTMLElement,
	parent: block2,
};

const render = create(
	FieldArray,
	{},
	{
		queries: {
			arrayError: {
				query: AccessorQueryType.TestId,
				parameters: ["users/error"],
			},

			addBlock: {
				query: AccessorQueryType.Text,
				parameters: ["Add"],
			},

			block1,
			block2,

			block1Remove,
			block2Remove,

			firstName1Input: {
				query: AccessorQueryType.QuerySelector,
				parameters: ["input"],
				parent: firstName1Field,
			},

			firstName1Error: {
				query: AccessorQueryType.QuerySelector,
				parameters: [
					"ul li",
					{
						waitForElementOptions: {
							timeout: 1500,
						},
					},
				],
				parent: firstName1Field,
			},

			lastName1Input: {
				query: AccessorQueryType.QuerySelector,
				parameters: ["input"],
				parent: lastName1Field,
			},

			lastName1Error: {
				query: AccessorQueryType.QuerySelector,
				parameters: [
					"ul li",
					{
						waitForElementOptions: {
							timeout: 1500,
						},
					},
				],
				parent: lastName1Field,
			},

			firstName2Input: {
				query: AccessorQueryType.QuerySelector,
				parameters: ["input"],
				parent: firstName2Field,
			},

			firstName2Error: {
				query: AccessorQueryType.QuerySelector,
				parameters: [
					"ul li",
					{
						waitForElementOptions: {
							timeout: 1500,
						},
					},
				],
				parent: firstName2Field,
			},

			lastName2Input: {
				query: AccessorQueryType.QuerySelector,
				parameters: ["input"],
				parent: lastName2Field,
			},

			lastName2Error: {
				query: AccessorQueryType.QuerySelector,
				parameters: [
					"ul li",
					{
						waitForElementOptions: {
							timeout: 1500,
						},
					},
				],
				parent: lastName2Field,
			},

			submitButton: {
				query: AccessorQueryType.Text,
				parameters: ["Submit"],
			},

			submitResult: {
				query: AccessorQueryType.Text,
				parameters: ["Submitted values:"],
				mapper: (element) => element.nextElementSibling as HTMLElement,
			},
		},

		fireEvents: {
			addBlock: ["addBlock", "click"],
			removeBlock1: ["block1Remove", "click"],
			removeBlock2: ["block2Remove", "click"],
			submit: ["submitButton", "submit"],
		},

		scenarios: {
			changeFirstName1: ["firstName1Input", changeInput],
			changeLastName1: ["lastName1Input", changeInput],
			changeFirstName2: ["firstName2Input", changeInput],
			changeLastName2: ["lastName2Input", changeInput],
		},
	},
);

afterEach(() => {
	cleanup();
});

test("render default form", async () => {
	const engine = render({});

	expect(engine.accessors.block1.query()).toBeTruthy();
	expect(engine.accessors.block2.query()).toBeFalsy();
	expect(engine.accessors.arrayError.query()).toBeFalsy();
});

test("submit successfully", async () => {
	const engine = render({});

	await engine.run("changeFirstName1", "foo");
	await engine.run("changeLastName1", "bar");

	engine.fireEvent("submit");

	const submitResult = await engine.accessors.submitResult.find();

	expect(submitResult.textContent).toBe(`{
  "users": [
    {
      "firstName": "foo",
      "lastName": "bar"
    }
  ]
}`);
});

test("submit after correcting errors", async () => {
	const engine = render({});

	engine.fireEvent("removeBlock1");

	expect(engine.accessors.block1.query()).toBeFalsy();
	expect(engine.accessors.block2.query()).toBeFalsy();

	engine.fireEvent("submit");

	{
		const arrayError = await engine.accessors.arrayError.find();

		expect(arrayError).toHaveProperty("textContent", "This field is required");
	}

	engine.fireEvent("addBlock");

	expect(engine.accessors.arrayError.query()).toBeFalsy();

	engine.fireEvent("addBlock");

	engine.fireEvent("submit");

	const firstName1Error = await engine.accessors.firstName1Error.find();
	const lastName1Error = await engine.accessors.lastName1Error.find();
	const firstName2Error = await engine.accessors.firstName1Error.find();
	const lastName2Error = await engine.accessors.lastName1Error.find();

	expect(firstName1Error.textContent).toBe("This field is required");
	expect(lastName1Error.textContent).toBe("This field is required");
	expect(firstName2Error.textContent).toBe("This field is required");
	expect(lastName2Error.textContent).toBe("This field is required");

	await engine.run("changeFirstName1", "foo1");
	await engine.run("changeLastName1", "bar1");
	await engine.run("changeFirstName2", "foo2");
	await engine.run("changeLastName2", "bar2");

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
  "users": [
    {
      "firstName": "foo1",
      "lastName": "bar1"
    },
    {
      "firstName": "foo2",
      "lastName": "bar2"
    }
  ]
}`);
});
