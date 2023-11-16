import * as formSchema from "@vtaits/form-schema";
import type { FormApi } from "final-form";
import type { ReactNode } from "react";
import * as reactAsyncHookMocks from "react-async-hook";
import { Form as FinalForm } from "react-final-form";
import { create } from "react-test-engine";
import { afterEach, expect, test, vi } from "vitest";

import { Form, defaultGetFieldSchema } from "./Form";
import { FormSchemaContext } from "./FormSchemaContext";
import { IS_VALUES_READY_NAME } from "./constants";
import { makeSetError } from "./makeSetError";
import type { FormProps } from "./types";

vi.mock("react-async-hook");
vi.mock("@vtaits/form-schema");
vi.mock("./makeSetError");

const mockedMakeSetError = vi.mocked(makeSetError);

type Values = Record<string, any>;
type Errors = Record<string, any>;

const defaultProps: FormProps<any, Values, Values, Values, Errors, any> = {
	names: [],
	children: (): ReactNode => null,
	getFieldType: vi.fn(),
	onSubmit: (): void => {},
};

const render = create(Form, defaultProps, {
	queries: {
		formSchemaContext: {
			component: FormSchemaContext.Provider,
		},

		finalForm: {
			component: FinalForm,
		},
	},

	properties: {
		contextValue: ["formSchemaContext", "value"],
	},
});

afterEach(() => {
	vi.clearAllMocks();
});

test("defaultGetFieldSchema", () => {
	expect(defaultGetFieldSchema("foo")).toBe("foo");
});

test("should provide parsed initial values", () => {
	const getFieldSchema = vi.fn();
	const getFieldType = vi.fn();
	const names = ["test"];

	const initialValues = {
		test1: "value1",
	};

	const parsedValues = {
		test2: "value2",
	};

	vi.mocked(formSchema.parse).mockReturnValue(parsedValues);

	vi.mocked(reactAsyncHookMocks.useAsync).mockReturnValue({
		result: undefined,
	} as unknown as ReturnType<typeof reactAsyncHookMocks.useAsync>);

	const engine = render({
		initialValues,
		getFieldSchema,
		getFieldType,
		names,
	});

	const formProps = engine.accessors.finalForm.getProps();

	expect(formProps.initialValues).toEqual({
		...parsedValues,
		[IS_VALUES_READY_NAME]: true,
	});

	expect(formSchema.parse).toHaveBeenCalledTimes(1);
	expect(formSchema.parse).toHaveBeenCalledWith({
		values: initialValues,
		names,
		getFieldSchema,
		getFieldType,
		parents: [
			{
				values: initialValues,
			},
		],
	});
});

test("should not provide initial values during asynchronous parse", () => {
	const getFieldSchema = vi.fn();
	const getFieldType = vi.fn();
	const names = ["test"];

	const initialValues = {
		test1: "value1",
	};

	const parsedValues = {
		test2: "value2",
	};

	vi.mocked(formSchema.parse).mockResolvedValue(parsedValues);

	vi.mocked(reactAsyncHookMocks.useAsync).mockReturnValue({
		result: undefined,
	} as unknown as ReturnType<typeof reactAsyncHookMocks.useAsync>);

	const engine = render({
		initialValues,
		getFieldSchema,
		getFieldType,
		names,
	});

	const formProps = engine.accessors.finalForm.getProps();

	expect(formProps.initialValues).toEqual({
		[IS_VALUES_READY_NAME]: false,
	});

	expect(formSchema.parse).toHaveBeenCalledTimes(1);
	expect(formSchema.parse).toHaveBeenCalledWith({
		values: initialValues,
		names,
		getFieldSchema,
		getFieldType,
		parents: [
			{
				values: initialValues,
			},
		],
	});
});

test("should not provide initial values with `initialValuesPlaceholder` during asynchronous parse", () => {
	const getFieldSchema = vi.fn();
	const getFieldType = vi.fn();
	const names = ["test"];

	const initialValues = {
		test1: "value1",
	};

	const parsedValues = {
		test2: "value2",
	};

	vi.mocked(formSchema.parse).mockResolvedValue(parsedValues);

	vi.mocked(reactAsyncHookMocks.useAsync).mockReturnValue({
		result: undefined,
	} as unknown as ReturnType<typeof reactAsyncHookMocks.useAsync>);

	const engine = render({
		initialValues,

		initialValuesPlaceholder: {
			test: "placeholderValue",
		},

		getFieldSchema,
		getFieldType,
		names,
	});

	const formProps = engine.accessors.finalForm.getProps();

	expect(formProps.initialValues).toEqual({
		[IS_VALUES_READY_NAME]: false,
		test: "placeholderValue",
	});

	expect(formSchema.parse).toHaveBeenCalledTimes(1);
	expect(formSchema.parse).toHaveBeenCalledWith({
		values: initialValues,
		names,
		getFieldSchema,
		getFieldType,
		parents: [
			{
				values: initialValues,
			},
		],
	});
});

test("should provide initial values after asynchronous parse", () => {
	const getFieldSchema = vi.fn();
	const getFieldType = vi.fn();
	const names = ["test"];

	const initialValues = {
		test1: "value1",
	};

	const parsedValues = {
		test2: "value2",
	};

	const asyncParsedValues = {
		test3: "value3",
	};

	vi.mocked(formSchema.parse).mockResolvedValue(parsedValues);

	vi.mocked(reactAsyncHookMocks.useAsync).mockReturnValue({
		result: asyncParsedValues,
	} as unknown as ReturnType<typeof reactAsyncHookMocks.useAsync>);

	const engine = render({
		initialValues,
		getFieldSchema,
		getFieldType,
		names,
	});

	const formProps = engine.accessors.finalForm.getProps();

	expect(formProps.initialValues).toEqual({
		...asyncParsedValues,
		[IS_VALUES_READY_NAME]: true,
	});

	expect(formSchema.parse).toHaveBeenCalledTimes(1);
	expect(formSchema.parse).toHaveBeenCalledWith({
		values: initialValues,
		names,
		getFieldSchema,
		getFieldType,
		parents: [
			{
				values: initialValues,
			},
		],
	});
});

test("should provide empty object to parser if initial values not defined", () => {
	const getFieldSchema = vi.fn();
	const getFieldType = vi.fn();
	const names = ["test"];

	const parsedValues = {
		test2: "value2",
	};

	vi.mocked(formSchema.parse).mockReturnValue(parsedValues);

	const engine = render({
		getFieldSchema,
		getFieldType,
		names,
	});

	const formProps = engine.accessors.finalForm.getProps();

	expect(formProps.initialValues).toEqual({
		...parsedValues,
		[IS_VALUES_READY_NAME]: true,
	});

	expect(formSchema.parse).toHaveBeenCalledTimes(1);
	expect(formSchema.parse).toHaveBeenCalledWith({
		values: {},
		names,
		getFieldSchema,
		getFieldType,
		parents: [
			{
				values: {},
			},
		],
	});
});

test("should validate before submit", async () => {
	const getFieldSchema = vi.fn();
	const getFieldType = vi.fn();
	const names = ["test"];

	const values = {
		test1: "value1",
	};

	const setError = vi.fn();

	mockedMakeSetError.mockImplementation((errors) => {
		errors.test2 = "error2";
		return setError;
	});

	const onSubmit = vi.fn();
	const mapErrors = vi.fn();

	const engine = render({
		getFieldSchema,
		getFieldType,
		names,

		mapErrors,

		onSubmit,
	});

	const formProps = engine.accessors.finalForm.getProps();

	const result = await formProps.onSubmit(
		values,
		{} as FormApi<unknown, unknown>,
	);

	expect(result).toEqual({
		test2: "error2",
	});

	expect(mockedMakeSetError).toHaveBeenCalledTimes(1);

	expect(formSchema.validateBeforeSubmit).toHaveBeenCalledTimes(1);
	expect(formSchema.validateBeforeSubmit).toHaveBeenCalledWith({
		setError,
		values,
		names,
		getFieldSchema,
		getFieldType,
		parents: [
			{
				values,
			},
		],
	});

	expect(formSchema.serialize).toHaveBeenCalledTimes(0);
	expect(onSubmit).toHaveBeenCalledTimes(0);
	expect(mapErrors).toHaveBeenCalledTimes(0);
	expect(formSchema.setFieldErrors).toHaveBeenCalledTimes(0);
});

test("should submit successfully", async () => {
	const getFieldSchema = vi.fn();
	const getFieldType = vi.fn();
	const names = ["test"];

	const values = {
		test1: "value1",
	};

	const serializedValues = {
		test2: "value2",
	};

	const setError = vi.fn();

	mockedMakeSetError.mockReturnValue(setError);

	vi.mocked(formSchema.serialize).mockReturnValue(serializedValues);

	const onSubmit = vi.fn();
	const mapErrors = vi.fn();

	const engine = render({
		getFieldSchema,
		getFieldType,
		names,

		mapErrors,

		onSubmit,
	});

	const formProps = engine.accessors.finalForm.getProps();

	const result = await formProps.onSubmit(
		values,
		{} as FormApi<unknown, unknown>,
	);

	expect(result).toBeFalsy();

	expect(mockedMakeSetError).toHaveBeenCalledTimes(1);

	expect(formSchema.serialize).toHaveBeenCalledTimes(1);
	expect(formSchema.serialize).toHaveBeenCalledWith({
		values,
		names,
		getFieldSchema,
		getFieldType,
		parents: [
			{
				values,
			},
		],
	});

	expect(onSubmit).toHaveBeenCalledTimes(1);
	expect(onSubmit).toHaveBeenCalledWith(serializedValues, values);

	expect(mapErrors).toHaveBeenCalledTimes(0);
	expect(formSchema.setFieldErrors).toHaveBeenCalledTimes(0);
});

test("should submit with error", async () => {
	const getFieldSchema = vi.fn();
	const getFieldType = vi.fn();
	const names = ["test"];

	const values = {
		test1: "value1",
	};

	const serializedValues = {
		test2: "value2",
	};

	const rawErrors = {
		test1: "error1",
	};

	const preparedErrors = {
		test2: "error2",
	};

	vi.mocked(formSchema.serialize).mockReturnValue(serializedValues);

	const onSubmit = vi.fn<[Values, Values], any>(() => rawErrors);
	const mapErrors = vi.fn<[Errors, Values, Values], any>(() => preparedErrors);

	const setError = vi.fn();

	mockedMakeSetError
		.mockImplementationOnce(() => vi.fn())
		.mockImplementationOnce((target) => {
			target.test3 = "error3";
			return setError;
		});

	const engine = render({
		getFieldSchema,
		getFieldType,
		names,

		mapErrors,

		onSubmit,
	});

	const formProps = engine.accessors.finalForm.getProps();

	const result = await formProps.onSubmit(
		values,
		{} as FormApi<unknown, unknown>,
	);

	expect(result).toEqual({
		test2: "error2",
		test3: "error3",
	});

	expect(formSchema.serialize).toHaveBeenCalledTimes(1);
	expect(formSchema.serialize).toHaveBeenCalledWith({
		values,
		names,
		getFieldSchema,
		getFieldType,
		parents: [
			{
				values,
			},
		],
	});

	expect(onSubmit).toHaveBeenCalledTimes(1);
	expect(onSubmit).toHaveBeenCalledWith(serializedValues, values);

	expect(mapErrors).toHaveBeenCalledTimes(1);
	expect(mapErrors).toHaveBeenCalledWith(rawErrors, serializedValues, values);

	expect(mockedMakeSetError).toHaveBeenCalledTimes(2);

	expect(formSchema.setFieldErrors).toHaveBeenCalledTimes(1);
	expect(formSchema.setFieldErrors).toHaveBeenCalledWith({
		setError,
		errors: preparedErrors,
		names,
		getFieldSchema,
		getFieldType,
		values: serializedValues,
		rawValues: values,
		parents: [
			{
				values,
			},
		],
	});
});

test("should provide form render props to children", () => {
	const getFieldSchema = vi.fn();
	const getFieldType = vi.fn();

	const children = vi.fn();

	const engine = render({
		getFieldSchema,
		getFieldType,

		children,
	});

	const formProps = engine.accessors.finalForm.getProps();

	expect(formProps.children).toBe(children);
});

test("provide correct value to `FormSchemaContext.Provider`", () => {
	const getFieldSchema = vi.fn();
	const getFieldType = vi.fn();

	const engine = render({
		getFieldSchema,
		getFieldType,
	});

	expect(engine.getProperty("contextValue")).toEqual({
		getFieldSchema,
		getFieldType,
	});
});
