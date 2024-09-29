import type { ParentType } from "@vtaits/form-schema";
import { useMemo } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
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
	};
});
vi.mock("./defaultRender");
vi.mock("../../core");

const fieldValue = {
	baz: "qux",
};

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
		fieldPath: "container.TEST_NAME",
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
	queries: {
		controller: {
			component: Controller,
		},
	},

	callbacks: {
		render: ["controller", "render"],
	},

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

	describe.each([
		[
			true,
			[
				{
					values: {},
				},
				{
					name,
					values: fieldValue,
				},
			],
		],
		[false, parents],
		[undefined, parents],
	])("nested = %s", (nested, expectedParents) => {
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
							nested,
							renderSet: renderFunction,
						},
					},
				},
				{
					names: ["foo", "bar"],
				},
			);

			expect(engine.accessors.controller.getProps().name).toBe(
				"container.TEST_NAME",
			);

			const renderResult = engine.getCallback("render")({
				field: {
					value: fieldValue,
				},
			});

			expect(renderResult).toBe(result);

			expect(targetRenderFunction).toHaveBeenCalledTimes(1);
			expect(vi.mocked(targetRenderFunction).mock.calls[0][1]).toEqual([
				"foo",
				"bar",
			]);

			const renderField = vi.mocked(targetRenderFunction).mock.calls[0][0];

			vi.mocked(renderBySchema).mockReturnValue("RENDERED");

			const name = "NAME";
			const payload = "PAYLOAD";

			expect(renderField(name, payload)).toBe("RENDERED");

			expect(renderBySchema).toHaveBeenCalledTimes(1);
			expect(renderBySchema).toHaveBeenCalledWith(
				formResult,
				getFieldSchema,
				getFieldType,
				getValues,
				name,
				payload,
				expectedParents,
			);
		});
	});
});
