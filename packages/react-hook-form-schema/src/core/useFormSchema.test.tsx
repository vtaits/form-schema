import {
	type FieldSchemaBase,
	parse,
	serialize,
	setFieldErrors,
	validateBeforeSubmit,
} from "@vtaits/form-schema";
import { useCallback, useDebugValue, useMemo } from "react";
import { type FieldValues, type UseFormReturn, useForm } from "react-hook-form";
import { create } from "react-test-engine-vitest";
import { afterEach, describe, expect, test, vi } from "vitest";
import { CLIENT_ERROR, SERVER_ERROR } from "./constants";
import { makeSetError } from "./makeSetError";
import { renderBySchema } from "./renderBySchema";
import type { UseFormSchemaParams, UseFormSchemaReturn } from "./types";
import { useFormSchema } from "./useFormSchema";

vi.mock("react", async () => {
	const actual = (await vi.importActual("react")) as Record<string, unknown>;

	return {
		...actual,
		useCallback: vi.fn(),
		useDebugValue: vi.fn(),
		useMemo: vi.fn(),
	};
});
vi.mock("react-hook-form");
vi.mock("@vtaits/form-schema");
vi.mock("./makeSetError");
vi.mock("./renderBySchema");

const mockedMakeSetError = vi.mocked(makeSetError);

function TestComponent<
	FieldSchema extends FieldSchemaBase,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
>(
	props: UseFormSchemaParams<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload,
		TContext
	>,
) {
	const result = useFormSchema(props);

	useDebugValue(result);

	return <div />;
}

const names = ["field1", "field2"];
const getFieldSchema = vi.fn();
const getFieldType = vi.fn();
const onSubmitBySchema = vi.fn();
const handleSubmitBySchema = vi.fn();
const renderField = vi.fn();
const getValues = vi.fn();
const setError = vi.fn();

const handleSubmit = vi.fn();
const formResult = {
	handleSubmit,
	watch: vi.fn(),
	getValues,
	setError,
} as unknown as UseFormReturn;

const defaultValues = {
	foo: "bar",
};

const render = create(
	TestComponent,
	{
		names,
		getFieldSchema,
		getFieldType,
	} as UseFormSchemaParams<
		FieldSchemaBase,
		FieldValues,
		FieldValues,
		FieldValues,
		Record<string, unknown>,
		unknown,
		unknown
	>,
	{
		queries: {},

		hooks: {
			defaultValues: useMemo,
			formResult: useForm,
			onSubmitBySchema: useCallback,
			handleSubmitBySchema: useCallback,
			renderField: useCallback,
			debugValue: useDebugValue,
		},

		hookOrder: [
			"defaultValues",
			"formResult",
			"onSubmitBySchema",
			"handleSubmitBySchema",
			"renderField",
			"debugValue",
		],

		hookDefaultValues: {
			defaultValues,
			formResult,
			onSubmitBySchema,
			handleSubmitBySchema,
			renderField,
			debugValue: undefined,
		},
	},
);

afterEach(() => {
	vi.clearAllMocks();
});

test("return result of `react-hook-form` and add own props", () => {
	const engine = render({});

	const result = engine.getHookArguments(
		"debugValue",
	)[0] as UseFormSchemaReturn;

	expect(result.watch).toBe(formResult.watch);
	expect(result.handleSubmit).toBe(handleSubmitBySchema);
	expect(result.renderField).toBe(renderField);
});

describe("parse default values", () => {
	test("provide correct dependencies", () => {
		const engine = render({
			defaultValues: {
				foo: "bar",
			},
		});

		expect(engine.getHookArguments("defaultValues")[1]).toEqual([
			{
				foo: "bar",
			},
			names,
			getFieldSchema,
			getFieldType,
		]);
	});

	test("provide synchronously parsed values", () => {
		const defaultValues = {
			test1: "value1",
		};

		const parsedValues = {
			test2: "value2",
		};

		vi.mocked(parse).mockReturnValue(parsedValues);

		const engine = render({
			defaultValues,
		});

		expect(engine.getHookArguments("defaultValues")[0]()).toBe(parsedValues);

		expect(parse).toHaveBeenCalledTimes(1);
		expect(parse).toHaveBeenCalledWith({
			values: defaultValues,
			names,
			getFieldSchema,
			getFieldType,
			parents: [
				{
					values: defaultValues,
				},
			],
		});
	});

	test("provide asynchronously parsed values", async () => {
		const defaultValues = {
			test1: "value1",
		};

		const parsedValues = {
			test2: "value2",
		};

		vi.mocked(parse).mockResolvedValue(parsedValues);

		const engine = render({
			defaultValues,
		});

		const resolvedValues = await (
			engine.getHookArguments("defaultValues")[0]() as () => Promise<unknown>
		)();

		expect(resolvedValues).toBe(parsedValues);

		expect(parse).toHaveBeenCalledTimes(1);
		expect(parse).toHaveBeenCalledWith({
			values: defaultValues,
			names,
			getFieldSchema,
			getFieldType,
			parents: [
				{
					values: defaultValues,
				},
			],
		});
	});

	test("provide asynchronously parsed values with load function", async () => {
		const defaultValues = {
			test1: "value1",
		};

		const parsedValues = {
			test2: "value2",
		};

		vi.mocked(parse).mockResolvedValue(parsedValues);

		const engine = render({
			defaultValues: vi.fn().mockResolvedValue(defaultValues),
		});

		const resolvedValues = await (
			engine.getHookArguments("defaultValues")[0]() as () => Promise<unknown>
		)();

		expect(resolvedValues).toBe(parsedValues);

		expect(parse).toHaveBeenCalledTimes(1);
		expect(parse).toHaveBeenCalledWith({
			values: defaultValues,
			names,
			getFieldSchema,
			getFieldType,
			parents: [
				{
					values: defaultValues,
				},
			],
		});
	});
});

describe("useForm", () => {
	test("provide props of `react-hook-form` and add own props", () => {
		const engine = render({
			mode: "onTouched",
		});

		const formProps = engine.getHookArguments("formResult")[0];

		expect(formProps?.mode).toBe("onTouched");
		expect(formProps?.defaultValues).toBe(defaultValues);
	});
});

describe("onSubmitBySchema", () => {
	test("provide correct dependencies", () => {
		const mapErrors = vi.fn();

		const engine = render({
			mapErrors,
		});

		expect(engine.getHookArguments("onSubmitBySchema")[1]).toEqual([
			names,
			getFieldSchema,
			getFieldType,
			mapErrors,
			setError,
		]);
	});

	test("should validate before submit", async () => {
		const values = {
			test1: "value1",
		};

		const setErrorResult = vi.fn();

		mockedMakeSetError.mockImplementation((setError, errorType, onError) => {
			onError();
			return setErrorResult;
		});

		const onSubmit = vi.fn();
		const mapErrors = vi.fn();

		const engine = render({
			mapErrors,
		});

		await engine.getHookArguments("onSubmitBySchema")[0](onSubmit, values);

		expect(mockedMakeSetError).toHaveBeenCalledTimes(1);
		expect(mockedMakeSetError.mock.calls[0][0]).toBe(setError);
		expect(mockedMakeSetError.mock.calls[0][1]).toBe(CLIENT_ERROR);

		expect(validateBeforeSubmit).toHaveBeenCalledTimes(1);
		expect(validateBeforeSubmit).toHaveBeenCalledWith({
			setError: setErrorResult,
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

		expect(serialize).toHaveBeenCalledTimes(0);
		expect(onSubmit).toHaveBeenCalledTimes(0);
		expect(mapErrors).toHaveBeenCalledTimes(0);
		expect(setFieldErrors).toHaveBeenCalledTimes(0);
	});

	test("submit successfully", async () => {
		const values = {
			test1: "value1",
		};

		const serializedValues = {
			test2: "value2",
		};

		const setErrorResult = vi.fn();
		mockedMakeSetError.mockReturnValue(setErrorResult);

		vi.mocked(serialize).mockReturnValue(serializedValues);

		const onSubmit = vi.fn();
		const mapErrors = vi.fn();

		const engine = render({
			mapErrors,
		});

		await engine.getHookArguments("onSubmitBySchema")[0](
			onSubmit,
			values,
			"event",
		);

		expect(mockedMakeSetError).toHaveBeenCalledTimes(1);
		expect(mockedMakeSetError.mock.calls[0][0]).toBe(setError);
		expect(mockedMakeSetError.mock.calls[0][1]).toBe(CLIENT_ERROR);

		expect(serialize).toHaveBeenCalledTimes(1);
		expect(serialize).toHaveBeenCalledWith({
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
		expect(onSubmit).toHaveBeenCalledWith(serializedValues, values, "event");

		expect(mapErrors).toHaveBeenCalledTimes(0);
		expect(setFieldErrors).toHaveBeenCalledTimes(0);
	});

	test("should submit with error", async () => {
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

		vi.mocked(serialize).mockReturnValue(serializedValues);

		const onSubmit = vi.fn().mockReturnValue(rawErrors);
		const mapErrors = vi.fn().mockReturnValue(preparedErrors);

		const setErrorResult = vi.fn();

		mockedMakeSetError
			.mockImplementationOnce(() => vi.fn())
			.mockImplementationOnce((setError, errorType, onError) => {
				onError();
				return setErrorResult;
			});

		const engine = render({
			mapErrors,
		});

		await engine.getHookArguments("onSubmitBySchema")[0](
			onSubmit,
			values,
			"event",
		);

		expect(serialize).toHaveBeenCalledTimes(1);
		expect(serialize).toHaveBeenCalledWith({
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
		expect(onSubmit).toHaveBeenCalledWith(serializedValues, values, "event");

		expect(mapErrors).toHaveBeenCalledTimes(1);
		expect(mapErrors).toHaveBeenCalledWith(rawErrors, serializedValues, values);

		expect(mockedMakeSetError).toHaveBeenCalledTimes(2);
		expect(mockedMakeSetError.mock.calls[1][0]).toBe(setError);
		expect(mockedMakeSetError.mock.calls[1][1]).toBe(SERVER_ERROR);

		expect(setFieldErrors).toHaveBeenCalledTimes(1);
		expect(setFieldErrors).toHaveBeenCalledWith({
			setError: setErrorResult,
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
});

describe("handleSubmitBySchema", () => {
	test("provide correct dependencies", () => {
		const engine = render({});

		expect(engine.getHookArguments("handleSubmitBySchema")[1]).toEqual([
			handleSubmit,
			onSubmitBySchema,
		]);
	});

	test("call with correct callbacks", () => {
		const onSubmitDomHandler = vi.fn();
		handleSubmit.mockReturnValue(onSubmitDomHandler);

		const onSubmitBySchemaResult = vi.fn();
		onSubmitBySchema.mockReturnValue(onSubmitBySchemaResult);

		const onSubmit = vi.fn();
		const onError = vi.fn();

		const engine = render({});

		const result = engine.getHookArguments("handleSubmitBySchema")[0](
			onSubmit,
			onError,
		);

		expect(handleSubmit).toHaveBeenCalledTimes(1);
		expect(handleSubmit.mock.calls[0][1]).toBe(onError);

		expect(
			handleSubmit.mock.calls[0][0](
				{
					foo: "bar",
				},
				"event",
			),
		).toBe(onSubmitBySchemaResult);

		expect(onSubmitBySchema).toHaveBeenCalledTimes(1);
		expect(onSubmitBySchema).toHaveBeenCalledWith(
			onSubmit,
			{
				foo: "bar",
			},
			"event",
		);
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
