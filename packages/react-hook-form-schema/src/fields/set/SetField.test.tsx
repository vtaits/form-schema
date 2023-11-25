import type { ParentType } from "@vtaits/form-schema";
import { useCallback, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { create } from "react-test-engine-vitest";
import { afterEach, describe, expect, test, vi } from "vitest";

import { renderBySchema } from "../../core";
import { SetField, type SetFieldProps } from "./SetField";
import { defaultRender } from "./defaultRender";

vi.mock("react", async () => {
	const actual = (await vi.importActual("react")) as Record<string, unknown>;

	return {
		...actual,
		useMemo: vi.fn(),
		useCallback: vi.fn(),
	};
});
vi.mock("./defaultRender");
vi.mock("../../core");

const getValues = vi.fn();

const formResult = {
	getValues,
} as unknown as UseFormReturn<any, any, any>;

const parents: ParentType[] = [
	{
		values: {},
	},
];

const renderField = vi.fn();
const getSchema = vi.fn();
const getFieldSchema = vi.fn();
const getFieldType = vi.fn();
const name = "TEST_NAME";
const payload = "PAYLOAD";

const schemas = {
	foo: 1,
	bar: {},
	baz: "3",
};

const defaultProps: SetFieldProps<any, any, any, any, any, any, any> = {
	renderParams: {
		fieldSchema: {
			schemas,
			getSchema,
		},
		name,
		getFieldSchema,
		getFieldType,
		parents,
		payload,
	},

	formResult,
};

const render = create(SetField, defaultProps, {
	queries: {},

	hooks: {
		names: useMemo,
		renderField: useCallback,
	},

	hookDefaultValues: {
		names: [],
		renderField,
	},

	hookOrder: ["names", "renderField"],
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
				renderParams: {
					...defaultProps.renderParams,
					fieldSchema: {
						...defaultProps.renderParams.fieldSchema,
						render: renderFunction,
					},
				},
			},
			{
				names: ["foo", "bar"],
			},
		);

		expect(engine.root).toBe(result);

		expect(targetRenderFunction).toHaveBeenCalledTimes(1);
		expect(targetRenderFunction).toHaveBeenCalledWith(renderField, [
			"foo",
			"bar",
		]);
	});
});

describe("renderField", () => {
	test("provide correct dependencies", () => {
		const engine = render({});

		expect(engine.getHookArguments("renderField")[1]).toEqual([
			formResult,
			getFieldSchema,
			getFieldType,
			getValues,
		]);
	});

	test("call `renderBySchema`", () => {
		vi.mocked(renderBySchema).mockReturnValue("RENDERED");

		const engine = render({});

		const name = "NAME";
		const payload = "PAYLOAD";
		const parents = [
			{
				values: {
					foo: "bar",
				},
			},
		];

		expect(
			engine.getHookArguments("renderField")[0](name, payload, parents),
		).toBe("RENDERED");

		expect(renderBySchema).toHaveBeenCalledTimes(1);
		expect(renderBySchema).toHaveBeenCalledWith(
			formResult,
			getFieldSchema,
			getFieldType,
			getValues,
			name,
			payload,
			parents,
		);
	});
});

describe("names", () => {
	test("provide correct dependencies", () => {
		const engine = render({});

		expect(engine.getHookArguments("names")[1]).toEqual([schemas]);
	});

	test("return keys of `schemas`", () => {
		vi.mocked(renderBySchema).mockReturnValue("RENDERED");

		const engine = render({});

		expect(engine.getHookArguments("names")[0]()).toEqual([
			"foo",
			"bar",
			"baz",
		]);
	});
});
