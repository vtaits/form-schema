import type { ParentType } from "@vtaits/form-schema";
import type { FormApi, FormState } from "final-form";
import { type ReactElement, useContext, useDebugValue, useMemo } from "react";
import { useForm, useFormState } from "react-final-form";
import { create } from "react-test-engine-vitest";
import { afterEach, describe, expect, test, vi } from "vitest";

import { useContext as useRequiredContext } from "@vtaits/react-required-context";

import { FormField } from "./FormField";
import { FormFieldContext } from "./FormFieldContext";
import type { FieldComponentProps } from "./types";

vi.mock("react", async () => {
	const actual = (await vi.importActual("react")) as Record<string, unknown>;

	return {
		...actual,
		useContext: vi.fn(),
		useMemo: vi.fn(),
	};
});
vi.mock("react-final-form");
vi.mock("@vtaits/react-required-context");

function TestComponent(
	props: FieldComponentProps<any, any, any, any, any, any>,
): ReactElement {
	useDebugValue(props);

	return <div />;
}

const formStateValues = {
	formStateField: "formStateFieldValue",
};

const form = {
	getState: () => ({
		values: formStateValues,
	}),
} as unknown as FormApi;

const parents: ParentType<Record<string, unknown>>[] = [
	{
		name: "test",
		values: {
			foo: "bar",
		},
	},
];

const fieldType = {
	component: TestComponent,
};

const getFieldSchema = vi.fn();
const getFieldType = vi.fn();
const rootGetFieldSchema = vi.fn();
const getChildFieldSchema = vi.fn();

const fieldContextValue = {
	getFieldSchema: vi.fn(),
};

const render = create(
	FormField,
	{
		name: "testName",
	},
	{
		queries: {
			field: {
				component: TestComponent,
			},

			formFieldContext: {
				component: FormFieldContext.Provider,
			},
		},

		properties: {
			contextValue: ["formFieldContext", "value"],
		},

		hooks: {
			useForm,
			useFormState,
			parents: useMemo,
			formSchemaContext: useRequiredContext,
			parentFieldContext: useContext,
			getFieldSchema: useMemo,
			fieldSchema: useMemo,
			fieldType: useMemo,
			getChildFieldSchema: useMemo,
			fieldContextValue: useMemo,
		},

		hookOrder: [
			"useForm",
			"useFormState",
			"parents",
			"formSchemaContext",
			"parentFieldContext",
			"getFieldSchema",
			"fieldSchema",
			"fieldType",
			"getChildFieldSchema",
			"fieldContextValue",
		],

		hookDefaultValues: {
			useForm: form,
			useFormState: {
				values: {},
			} as FormState<Record<string, any>>,
			parents,
			getFieldSchema,
			fieldSchema: "fieldSchema",
			fieldType,
			formSchemaContext: {
				getFieldSchema: vi.fn(),
				getFieldType,
			},
			parentFieldContext: null,
			getChildFieldSchema,
			fieldContextValue,
		},
	},
);

afterEach(() => {
	vi.resetAllMocks();
});

describe("parents", () => {
	test("should provide correct dependencies", () => {
		const engine = render(
			{
				parents: [
					{
						name: "testParentName",
						values: {
							foo: "baz",
						},
					},
				],
			},
			{
				useFormState: {
					values: {
						fieldName: "fieldValue",
					},
				} as unknown as FormState<Record<string, any>>,
			},
		);

		expect(engine.getHookArguments("parents")[1]).toEqual([
			[
				{
					name: "testParentName",
					values: {
						foo: "baz",
					},
				},
			],
			{
				fieldName: "fieldValue",
			},
		]);
	});

	test("should return parents from props", () => {
		const engine = render(
			{
				parents: [
					{
						name: "testParentName",
						values: {
							foo: "baz",
						},
					},
				],
			},
			{
				useFormState: {
					values: {
						fieldName: "fieldValue",
					},
				} as unknown as FormState<Record<string, any>>,
			},
		);

		expect(engine.getHookArguments("parents")[0]()).toEqual([
			{
				name: "testParentName",
				values: {
					foo: "baz",
				},
			},
		]);
	});

	test("should make root parents if `parents` prop is not provided", () => {
		const engine = render(
			{},
			{
				useFormState: {
					values: {
						fieldName: "fieldValue",
					},
				} as unknown as FormState<Record<string, any>>,
			},
		);

		expect(engine.getHookArguments("parents")[0]()).toEqual([
			{
				values: {
					fieldName: "fieldValue",
				},
			},
		]);
	});
});

describe("getFieldSchema", () => {
	test("should provide correct dependencies", () => {
		const parentFieldContext = {
			getFieldSchema: vi.fn(),
		};

		const engine = render(
			{},
			{
				parentFieldContext,
				formSchemaContext: {
					getFieldSchema: rootGetFieldSchema,
				},
			},
		);

		expect(engine.getHookArguments("getFieldSchema")[1]).toEqual([
			parentFieldContext,
			rootGetFieldSchema,
		]);
	});

	test("should return `getFieldSchema` from parent context if defined", () => {
		const parentFieldContext = {
			getFieldSchema: vi.fn(),
		};

		const engine = render(
			{},
			{
				parentFieldContext,
				formSchemaContext: {
					getFieldSchema: rootGetFieldSchema,
				},
			},
		);

		expect(engine.getHookArguments("getFieldSchema")[0]()).toBe(
			parentFieldContext.getFieldSchema,
		);
	});

	test("should return `getFieldSchema` from form context", () => {
		const rootGetFieldSchema = vi.fn();

		const engine = render(
			{},
			{
				formSchemaContext: {
					getFieldSchema: rootGetFieldSchema,
				},
			},
		);

		expect(engine.getHookArguments("getFieldSchema")[0]()).toBe(
			rootGetFieldSchema,
		);
	});
});

describe("fieldSchema", () => {
	test("should provide correct dependencies", () => {
		const engine = render({}, {});

		expect(engine.getHookArguments("fieldSchema")[1]).toEqual([
			getFieldSchema,
			"testName",
		]);
	});

	test("should make schema of the field", () => {
		getFieldSchema.mockReturnValue("schema of the field");

		const engine = render({}, {});

		expect(engine.getHookArguments("fieldSchema")[0]()).toBe(
			"schema of the field",
		);

		expect(getFieldSchema).toHaveBeenCalledTimes(1);
		expect(getFieldSchema).toHaveBeenCalledWith("testName");
	});
});

describe("fieldType", () => {
	test("should provide correct dependencies", () => {
		const engine = render({}, {});

		expect(engine.getHookArguments("fieldType")[1]).toEqual([
			getFieldType,
			"fieldSchema",
		]);
	});

	test("should return result of `getFieldType`", () => {
		getFieldType.mockReturnValue(fieldType);

		const engine = render({}, {});

		expect(engine.getHookArguments("fieldType")[0]()).toBe(fieldType);

		expect(getFieldType).toHaveBeenCalledTimes(1);
		expect(getFieldType).toHaveBeenCalledWith("fieldSchema");
	});
});

describe("getChildFieldSchema", () => {
	test("should provide correct dependencies", () => {
		const engine = render({}, {});

		expect(engine.getHookArguments("getChildFieldSchema")[1]).toEqual([
			"fieldSchema",
			getFieldSchema,
			getFieldType,
			form,
			fieldType,
			parents,
		]);
	});

	test("should return default `getFieldSchema` if it is not redefined in the type of current field", () => {
		const engine = render({}, {});

		expect(engine.getHookArguments("getChildFieldSchema")[0]()).toBe(
			getFieldSchema,
		);
	});

	test("should return redefined `getFieldSchema`", () => {
		const childGetFieldSchema = vi.fn();
		const createGetFieldSchema = vi.fn().mockReturnValue(childGetFieldSchema);

		const engine = render(
			{},
			{
				fieldType: {
					component: TestComponent,
					createGetFieldSchema,
				},
			},
		);

		expect(engine.getHookArguments("getChildFieldSchema")[0]()).toBe(
			childGetFieldSchema,
		);

		expect(createGetFieldSchema).toHaveBeenCalledTimes(1);
		expect(createGetFieldSchema).toHaveBeenCalledWith({
			fieldSchema: "fieldSchema",
			getFieldSchema,
			getFieldType,
			values: formStateValues,
			phase: "render",
			parents,
		});
	});
});

describe("fieldContextValue", () => {
	test("should provide correct dependencies", () => {
		const engine = render({}, {});

		expect(engine.getHookArguments("fieldContextValue")[1]).toEqual([
			getChildFieldSchema,
		]);
	});

	test("should return correct value", () => {
		const engine = render({}, {});

		expect(engine.getHookArguments("fieldContextValue")[0]()).toEqual({
			getFieldSchema: getChildFieldSchema,
		});
	});
});

describe("render", () => {
	test("should provide correct props to components", () => {
		const engine = render(
			{
				payload: "testPayload",
			},
			{},
		);

		expect(engine.getProperty("contextValue")).toBe(fieldContextValue);
		expect(engine.accessors.field.getProps()).toEqual({
			name: "testName",
			fieldSchema: "fieldSchema",
			payload: "testPayload",
			getFieldSchema,
			getFieldType,
			parents,
		});
	});
});
