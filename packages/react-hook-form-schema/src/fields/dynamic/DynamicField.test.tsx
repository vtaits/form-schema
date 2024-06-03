import type { ParentType } from "@vtaits/form-schema";
import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import { create } from "react-test-engine-vitest";
import useLatest from "use-latest";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { type FieldType, renderBySchema } from "../../core";
import { DynamicField } from "./DynamicField";
import type { DynamicFieldProps } from "./DynamicField";

vi.mock("react", async () => {
	const actual = (await vi.importActual("react")) as Record<string, unknown>;

	return {
		...actual,
		useEffect: vi.fn(),
		useRef: vi.fn(),
	};
});
vi.mock("use-latest");
vi.mock("../../core");

const watch = vi.fn();
const getValues = vi.fn();

const formResult = {
	getValues,
	watch,
} as unknown as UseFormReturn<any, any, any>;

const parents: ParentType[] = [
	{
		values: {},
	},
];

const renderResult = <span>RENDER_RESULT</span>;

const renderField = vi.fn();

const fieldType: FieldType<any> = {
	render: renderField,
};

const getSchema = vi.fn();
const getFieldSchema = vi.fn();
const getFieldType = vi.fn();
const name = "TEST_NAME";
const payload = "PAYLOAD";

const defaultProps: DynamicFieldProps<any, any, any, any, any, any, any> = {
	renderParams: {
		fieldPath: "container.TEST_NAME",
		fieldSchema: {
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

const render = create(DynamicField, defaultProps, {
	queries: {
		field: {
			component: "span",
		},
	},

	hooks: {
		formResultRef: useLatest,
		onShowRef: useLatest,
		onHideRef: useLatest,
		schemaRef: useLatest,
		useEffect,
		isFirstRenderRef: useRef,
	},

	hookOrder: [
		"formResultRef",
		"onShowRef",
		"onHideRef",
		"schemaRef",
		"isFirstRenderRef",
		"useEffect",
	],

	hookDefaultValues: {
		formResultRef: {
			current: formResult,
		},
		onShowRef: {
			current: undefined,
		},
		onHideRef: {
			current: undefined,
		},
		schemaRef: {
			current: null,
		},
		useEffect: undefined,
		isFirstRenderRef: {
			current: true,
		},
	},
});

beforeEach(() => {
	renderField.mockReturnValue(renderResult);
});

afterEach(() => {
	vi.clearAllMocks();
});

describe("getSchema", () => {
	test("should provide form values to `getSchema`", () => {
		getFieldSchema.mockReturnValue(null);
		getFieldType.mockReturnValue(fieldType);

		const values = {
			field1: "value1",
		};

		watch.mockReturnValue(values);

		render({});

		expect(getSchema).toHaveBeenCalledTimes(1);
		expect(getSchema).toHaveBeenCalledWith(
			values,
			"render",
			getFieldSchema,
			getFieldType,
			parents,
		);
	});

	test.each([
		["test", true],
		[null, false],
	])("result of `getSchema` = %s, rendered = %s", (schema, isRendered) => {
		getSchema.mockReturnValue(schema);
		getFieldType.mockReturnValue(fieldType);

		vi.mocked(renderBySchema).mockReturnValue(<span />);

		const engine = render({});

		expect(engine.checkIsRendered()).toBe(isRendered);
	});
});

describe("render", () => {
	test("should provide correct props to rendered component", () => {
		getSchema.mockReturnValue("test");
		getFieldType.mockReturnValue(fieldType);

		render({});

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

describe("callbacks", () => {
	function setupForCallbacks(...args: Parameters<typeof render>) {
		const engine = render(...args);

		expect(useEffect).toBeCalledTimes(1);
		const effect = engine.getHookArguments("useEffect")[0];

		effect();
	}

	test("should not call `onShow` in first render and change `isFirstRender`", () => {
		const onShow = vi.fn();
		const onHide = vi.fn();

		const refValue = { current: true };

		setupForCallbacks(
			{
				renderParams: {
					...defaultProps.renderParams,
					fieldSchema: {
						...defaultProps.renderParams.fieldSchema,
						onShow,
						onHide,
					},
				},
			},
			{
				isFirstRenderRef: refValue,
				onShowRef: {
					current: onShow,
				},
				onHideRef: {
					current: onHide,
				},
			},
		);

		expect(onShow).toHaveBeenCalledTimes(0);
		expect(onHide).toHaveBeenCalledTimes(0);

		expect(refValue.current).toBe(false);
	});

	test("should not call `onHide` in first render and change `isFirstRender`", () => {
		const onShow = vi.fn();
		const onHide = vi.fn();

		const refValue = { current: true };

		setupForCallbacks(
			{
				renderParams: {
					...defaultProps.renderParams,
					fieldSchema: {
						...defaultProps.renderParams.fieldSchema,
						onShow,
						onHide,
					},
				},
			},
			{
				isFirstRenderRef: refValue,
				onShowRef: {
					current: onShow,
				},
				onHideRef: {
					current: onHide,
				},
			},
		);

		expect(onShow).toHaveBeenCalledTimes(0);
		expect(onHide).toHaveBeenCalledTimes(0);

		expect(refValue.current).toBe(false);
	});

	test("should call `onShow` and not change `isFirstRender`", () => {
		const onShow = vi.fn();
		const onHide = vi.fn();

		const refValue = { current: false };

		setupForCallbacks(
			{
				renderParams: {
					...defaultProps.renderParams,
					fieldSchema: {
						...defaultProps.renderParams.fieldSchema,
						onShow,
						onHide,
					},
				},
			},
			{
				isFirstRenderRef: refValue,
				onShowRef: {
					current: onShow,
				},
				onHideRef: {
					current: onHide,
				},
				schemaRef: {
					current: "schema",
				},
			},
		);

		expect(onShow).toHaveBeenCalledTimes(1);
		expect(onShow).toHaveBeenCalledWith(
			formResult,
			name,
			"schema",
			getFieldSchema,
			getFieldType,
			parents,
		);

		expect(onHide).toHaveBeenCalledTimes(0);

		expect(refValue.current).toBe(false);
	});

	test("should call `onHide` and not change `isFirstRender`", () => {
		const onShow = vi.fn();
		const onHide = vi.fn();

		const refValue = { current: false };

		getSchema.mockReturnValue(null);

		setupForCallbacks(
			{
				renderParams: {
					...defaultProps.renderParams,
					fieldSchema: {
						...defaultProps.renderParams.fieldSchema,
						onShow,
						onHide,
					},
				},
			},
			{
				isFirstRenderRef: refValue,
				onShowRef: {
					current: onShow,
				},
				onHideRef: {
					current: onHide,
				},
			},
		);

		expect(onShow).toHaveBeenCalledTimes(0);

		expect(onHide).toHaveBeenCalledTimes(1);
		expect(onHide).toHaveBeenCalledWith(
			formResult,
			name,
			getFieldSchema,
			getFieldType,
			parents,
		);

		expect(refValue.current).toBe(false);
	});
});
