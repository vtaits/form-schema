import { useMemo } from "react";
import { create } from "react-test-engine-vitest";
import { afterEach, describe, expect, test, vi } from "vitest";

import type { FieldComponentProps } from "../../core";
import { SetField } from "./component";
import { defaultRender } from "./defaultRender";

vi.mock("react", async () => {
	const actual = (await vi.importActual("react")) as Record<string, unknown>;

	return {
		...actual,
		useMemo: vi.fn(),
	};
});
vi.mock("./defaultRender");

const schemas = {
	foo: 1,
	bar: {},
	baz: "3",
};

const defaultProps: FieldComponentProps<any, any, any, any, any, any> = {
	fieldSchema: {
		schemas,
	},
	name: "testName",
	getFieldSchema: vi.fn(),
	getFieldType: vi.fn(),
	parents: [],
};

const render = create(SetField, defaultProps, {
	queries: {},

	hooks: {
		names: useMemo,
	},

	hookDefaultValues: {
		names: [],
	},

	hookOrder: ["names"],
});

afterEach(() => {
	vi.clearAllMocks();
});

describe("return result of render", () => {
	const renderParam = vi.fn();

	test.each([
		["default render", undefined, defaultRender],
		["custom render", renderParam, renderParam],
	])("%s", (_, renderFunction, targetRenderFunction) => {
		const result = <span>RENDER_RESULT</span>;

		vi.mocked(targetRenderFunction).mockReturnValue(result);

		const engine = render(
			{
				fieldSchema: {
					...defaultProps.fieldSchema,
					render: renderFunction,
				},
			},
			{
				names: ["foo", "bar"],
			},
		);

		expect(engine.root).toBe(result);

		expect(targetRenderFunction).toHaveBeenCalledTimes(1);
		expect(targetRenderFunction).toHaveBeenCalledWith(["foo", "bar"]);
	});
});

describe("names", () => {
	test("provide correct dependencies", () => {
		const engine = render({});

		expect(engine.getHookArguments("names")[1]).toEqual([schemas]);
	});

	test("return keys of `schemas`", () => {
		const engine = render({});

		expect(engine.getHookArguments("names")[0]()).toEqual([
			"foo",
			"bar",
			"baz",
		]);
	});
});
