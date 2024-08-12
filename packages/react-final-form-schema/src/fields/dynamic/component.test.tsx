import type { FieldSchemaBase, ParentType } from "@vtaits/form-schema";
import type { FormApi, FormState } from "final-form";
import {
	type FC,
	type ReactElement,
	useDebugValue,
	useEffect,
	useRef,
} from "react";
import { useForm, useFormState } from "react-final-form";
import { create } from "react-test-engine-vitest";
import useLatest from "use-latest";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
	type FieldComponentProps,
	type FieldType,
	FormField,
	useFormSchemaState,
} from "../../core";
import { DynamicField } from "./component";
import type { DynamicSchema } from "./schema";

vi.mock("react", async () => {
	const actual = (await vi.importActual("react")) as Record<string, unknown>;

	return {
		...actual,
		useEffect: vi.fn(),
		useRef: vi.fn(),
	};
});
vi.mock("react-final-form");
vi.mock("use-latest");
vi.mock("../../core");

const parents: ParentType[] = [
	{
		values: {},
	},
];

function TestComponent(props: FieldComponentProps<any>): ReactElement | null {
	useDebugValue(props);

	return null;
}

const fieldType: FieldType<any> = {
	component: TestComponent as FC<FieldComponentProps<any>>,
};

const defaultProps: FieldComponentProps<any, any, any, any, any, any> = {
	fieldSchema: {
		getSchema: () => "test",
	},
	name: "testName",
	getFieldSchema: vi.fn(),
	getFieldType: vi.fn().mockReturnValue(fieldType),
	parents,
};

const form = {
	TYPE: "FORM",
} as unknown as FormApi;

const render = create(DynamicField, defaultProps, {
	queries: {
		field: {
			component: FormField,
		},
	},

	hooks: {
		onShowRef: useLatest,
		onHideRef: useLatest,
		schemaRef: useLatest,
		useEffect,
		useForm,
		useFormState,
		useFormSchemaState,
		useRef,
	},

	hookOrder: [
		"useForm",
		"useFormState",
		"useFormSchemaState",
		"onShowRef",
		"onHideRef",
		"schemaRef",
		"useRef",
		"useEffect",
	],

	hookDefaultValues: {
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
		useForm: form,
		useFormState: {
			values: {},
		} as FormState<Record<string, any>>,
		useFormSchemaState: {
			isValuesReady: false,
		},
		useRef: {
			current: true,
		},
	},
});

afterEach(() => {
	vi.clearAllMocks();
});

describe("getSchema", () => {
	test("should provide form values to `getSchema`", () => {
		const getSchema = vi.fn();
		const getFieldSchema = () => ({});
		const getFieldType = () => fieldType;

		const values: Record<string, any> = {
			field1: "value1",
		};

		render(
			{
				fieldSchema: {
					getSchema,
				} as DynamicSchema<FieldSchemaBase>,
				name: "test",
				getFieldSchema,
				getFieldType,
			},
			{
				useFormState: {
					values,
				} as FormState<Record<string, any>>,
			},
		);

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
		const engine = render({
			fieldSchema: {
				getSchema: () => schema,
			} as DynamicSchema<FieldSchemaBase>,
			name: "test",
			getFieldSchema: () => ({}),
			getFieldType: () => fieldType,
		});

		expect(engine.checkIsRendered()).toBe(isRendered);
	});
});

describe("render", () => {
	test("should provide correct props to rendered component", () => {
		const getFieldSchema = vi.fn();
		const getFieldType = vi.fn().mockReturnValue(fieldType);

		const wrapper = render({
			fieldSchema: {
				getSchema: () => "test",
			} as DynamicSchema<FieldSchemaBase>,
			name: "testName",
			getFieldSchema,
			getFieldType,
		});

		const allProps = wrapper.accessors.field.getProps();
		expect(allProps.name).toBe("testName");
	});
});

describe("callbacks", () => {
	function setupForCallbacks(...args: Parameters<typeof render>) {
		const engine = render(...args);

		expect(useEffect).toBeCalledTimes(1);
		const effect = engine.getHookArguments("useEffect")[0];

		effect();
	}

	test("should not call `onShow` and `onHide` if values are not ready and not change `isFirstRender`", () => {
		const onShow = vi.fn();
		const onHide = vi.fn();

		const refValue = { current: false };

		setupForCallbacks(
			{
				fieldSchema: {
					getSchema: () => "schema",
					onShow,
					onHide,
				} as DynamicSchema<FieldSchemaBase>,
			},
			{
				useFormSchemaState: {
					isValuesReady: false,
				},
				useRef: refValue,
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

	test("should not call `onShow` in first render and change `isFirstRender`", () => {
		const onShow = vi.fn();
		const onHide = vi.fn();

		const refValue = { current: true };

		setupForCallbacks(
			{
				fieldSchema: {
					getSchema: () => "schema",
					onShow,
					onHide,
				} as DynamicSchema<FieldSchemaBase>,
			},
			{
				useFormSchemaState: {
					isValuesReady: true,
				},
				useRef: refValue,
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
				fieldSchema: {
					getSchema: () => null,
					onShow,
					onHide,
				} as DynamicSchema<FieldSchemaBase>,
			},
			{
				useFormSchemaState: {
					isValuesReady: true,
				},
				useRef: refValue,
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
				fieldSchema: {
					getSchema: () => "schema",
					onShow,
					onHide,
				} as DynamicSchema<FieldSchemaBase>,
			},
			{
				useFormSchemaState: {
					isValuesReady: true,
				},
				useRef: refValue,
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
			form,
			"testName",
			"schema",
			defaultProps.getFieldSchema,
			defaultProps.getFieldType,
			parents,
		);

		expect(onHide).toHaveBeenCalledTimes(0);

		expect(refValue.current).toBe(false);
	});

	test("should call `onHide` and not change `isFirstRender`", () => {
		const onShow = vi.fn();
		const onHide = vi.fn();

		const refValue = { current: false };

		setupForCallbacks(
			{
				fieldSchema: {
					getSchema: () => null,
					onShow,
					onHide,
				} as DynamicSchema<FieldSchemaBase>,
			},
			{
				useFormSchemaState: {
					isValuesReady: true,
				},
				useRef: refValue,
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
			form,
			"testName",
			defaultProps.getFieldSchema,
			defaultProps.getFieldType,
			parents,
		);

		expect(refValue.current).toBe(false);
	});
});
