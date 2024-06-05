import { waitFor } from "@testing-library/dom";
import { cleanup } from "@testing-library/react";
import { AccessorQueryType, create } from "react-integration-test-engine";
import { afterEach, expect, test } from "vitest";
import { FormError } from "./FormError";

const render = create(
	FormError,
	{},
	{
		queries: {
			submitError: {
				query: AccessorQueryType.Text,
				parameters: ["Error"],
			},

			submitButton: {
				query: AccessorQueryType.QuerySelector,
				parameters: ["button"],
			},
		},

		fireEvents: {
			submit: ["submitButton", "submit"],
		},
	},
);

afterEach(() => {
	cleanup();
});

test("submit with error", async () => {
	const engine = render({});

	engine.fireEvent("submit");

	await waitFor(() => {
		expect(engine.accessors.submitButton.get()).toHaveProperty(
			"disabled",
			true,
		);
	});

	await waitFor(() => {
		expect(engine.accessors.submitButton.get()).toHaveProperty(
			"disabled",
			false,
		);
	});

	await engine.accessors.submitError.find();

	engine.fireEvent("submit");

	await waitFor(() => {
		expect(engine.accessors.submitButton.get()).toHaveProperty(
			"disabled",
			true,
		);
	});

	expect(engine.accessors.submitError.query()).toBeFalsy();

	await waitFor(() => {
		expect(engine.accessors.submitButton.get()).toHaveProperty(
			"disabled",
			false,
		);
	});
});
