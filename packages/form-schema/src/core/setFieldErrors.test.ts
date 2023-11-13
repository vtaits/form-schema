import { afterEach, describe, expect, test, vi } from "vitest";
import { defaultFieldErrorsSetter, setFieldErrors } from "./setFieldErrors";
import type {
	CreateGetFieldSchema,
	ErrorsSetter,
	FieldType,
	GetFieldSchema,
	GetFieldType,
} from "./types";

type Values = Record<string, any>;

type ErrorsSetterArgs = Parameters<ErrorsSetter<any, any, any, any, any>>;

const setError = vi.fn();

const parents = [
	{
		values: {},
	},
];

afterEach(() => {
	vi.clearAllMocks();
});

describe("defaultFieldErrorsSetter", () => {
	test("set error by name", () => {
		defaultFieldErrorsSetter(
			setError,
			{
				foo: "error1",
				bar: "error2",
			},
			"foo",
			null,
			vi.fn(),
			vi.fn(),
			{},
			{},
			parents,
		);

		expect(setError).toHaveBeenCalledTimes(1);
		expect(setError).toHaveBeenNthCalledWith(1, "foo", parents, "error1");
	});

	test("not set error if there is no error by name", () => {
		defaultFieldErrorsSetter(
			setError,
			{
				bar: "error2",
			},
			"foo",
			null,
			vi.fn(),
			vi.fn(),
			{},
			{},
			parents,
		);
		expect(setError).toHaveBeenCalledTimes(0);
	});
});

describe("setFieldErrors", () => {
	test("should call default errors mapper", () => {
		setFieldErrors(
			setError,
			{
				value: ["test"],
				value2: ["test2"],
			},
			["value"],
			(): any => ({
				type: "testType",
				name: "value",
			}),
			(): FieldType<any, any, any, any, any> => ({}),
			{},
			{},
			parents,
		);

		expect(setError).toHaveBeenCalledTimes(1);
		expect(setError).toHaveBeenNthCalledWith(1, "value", parents, ["test"]);
	});

	test("should call redefined errors mapper", () => {
		setFieldErrors(
			setError,
			{
				value: ["test"],
				value2: ["test2"],
			} as Record<string, string[]>,
			["value"],
			(): any => ({
				type: "testType",
				name: "value",
			}),
			() => ({
				errorsSetter: (
					setErrorCb,
					errors,
					name,
					fieldSchema,
					computedGetFieldSchema,
					getFieldType,
					values,
					rawValues,
					parents,
				) => {
					setErrorCb(name, parents, [errors[name][0] + errors[name][0]]);
				},
			}),
			{},
			{},
			parents,
		);

		expect(setError).toHaveBeenCalledTimes(1);
		expect(setError).toHaveBeenNthCalledWith(1, "value", parents, ["testtest"]);
	});

	test("should call multiple errors mappers", () => {
		const fields: Record<
			string,
			{
				type: string;
			}
		> = {
			value1: {
				type: "testType1",
			},
			value2: {
				type: "testType2",
			},
		};

		const fieldTypes: Record<string, FieldType<any, any, any, any, any>> = {
			testType1: {
				errorsSetter: (
					setErrorCb,
					errors,
					name,
					fieldSchema,
					computedGetFieldSchema,
					getFieldType,
					values,
					rawValues,
					parents,
				) => {
					setErrorCb(name, parents, [
						errors[name][0] + errors[name][0] + errors[name][0],
					]);
				},
			},
			testType2: {
				errorsSetter: (
					setErrorCb,
					errors,
					name,
					fieldSchema,
					computedGetFieldSchema,
					getFieldType,
					values,
					rawValues,
					parents,
				) => {
					setErrorCb(name, parents, [errors[name][0] + errors[name][0]]);
				},
			},
		};

		setFieldErrors(
			setError,
			{
				value1: ["test1"],
				value2: ["test2"],
			},
			["value1", "value2"],
			(name): any => ({
				...fields[name],
				name,
			}),
			({ type }: { type: string }): FieldType<any, any, any, any, any> =>
				fieldTypes[type],
			{},
			{},
			parents,
		);

		expect(setError).toHaveBeenCalledTimes(2);
		expect(setError).toHaveBeenNthCalledWith(1, "value1", parents, [
			"test1test1test1",
		]);
		expect(setError).toHaveBeenNthCalledWith(2, "value2", parents, [
			"test2test2",
		]);
	});

	test("should call multiple nested errors mappers", () => {
		const fields: Record<
			string,
			{
				type: string;
				childNames: readonly string[];
				childs: Record<
					string,
					{
						type: string;
					}
				>;
			}
		> = {
			wrapper1: {
				type: "wrapper",
				childNames: ["value1", "value2"],
				childs: {
					value1: {
						type: "testType1",
					},
					value2: {
						type: "testType2",
					},
				},
			},

			wrapper2: {
				type: "wrapper",
				childNames: ["value3", "value4"],
				childs: {
					value3: {
						type: "testType1",
					},
					value4: {
						type: "testType2",
					},
				},
			},
		};

		const fieldTypes: Record<string, FieldType<any, any, any, any, any>> = {
			wrapper: {
				errorsSetter: (
					setErrorCb,
					errors,
					name,
					{ childNames, childs }: any,
					getFieldSchema,
					getFieldType,
				) => {
					setFieldErrors(
						setError,
						errors,
						childNames,
						(childName) => ({
							...childs[childName],
							name: childName,
						}),
						getFieldType,
						{},
						{},
						parents,
					);
				},
			},

			testType1: {
				errorsSetter: (
					setErrorCb,
					errors,
					name,
					fieldSchema,
					computedGetFieldSchema,
					getFieldType,
					values,
					rawValues,
					parents,
				) => {
					setErrorCb(name, parents, [
						errors[name][0] + errors[name][0] + errors[name][0],
					]);
				},
			},

			testType2: {
				errorsSetter: (
					setErrorCb,
					errors,
					name,
					fieldSchema,
					computedGetFieldSchema,
					getFieldType,
					values,
					rawValues,
					parents,
				) => {
					setErrorCb(name, parents, [errors[name][0] + errors[name][0]]);
				},
			},
		};

		setFieldErrors(
			setError,
			{
				value1: ["test1"],
				value2: ["test2"],
				value3: ["test3"],
				value4: ["test4"],
			},

			["wrapper1", "wrapper2"],

			(name: string): any => ({
				...fields[name],
				name,
			}),

			({ type }: { type: string }): FieldType<any, any, any, any, any> =>
				fieldTypes[type],

			{},
			{},
			parents,
		);

		expect(setError).toHaveBeenCalledTimes(4);
		expect(setError).toHaveBeenNthCalledWith(1, "value1", parents, [
			"test1test1test1",
		]);
		expect(setError).toHaveBeenNthCalledWith(2, "value2", parents, [
			"test2test2",
		]);
		expect(setError).toHaveBeenNthCalledWith(3, "value3", parents, [
			"test3test3test3",
		]);
		expect(setError).toHaveBeenNthCalledWith(4, "value4", parents, [
			"test4test4",
		]);
	});

	test("should provide correct arguments to errorsSetter", () => {
		const errorsSetter = vi.fn();

		const values: Values = {
			value: "testValue",
		};

		const valuesRaw: Values = {
			value: "testValueRaw",
		};

		const getFieldSchema: GetFieldSchema<any> = () => ({
			type: "testType",
			name: "value",
		});

		const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
			errorsSetter,
		});

		setFieldErrors(
			setError,
			{
				value: "test",
			},
			["value"],
			getFieldSchema,
			getFieldType,
			values,
			valuesRaw,
			parents,
		);

		expect(errorsSetter).toHaveBeenCalledTimes(1);
		expect(errorsSetter).toHaveBeenCalledWith(
			setError,
			{
				value: "test",
			},
			"value",
			{
				type: "testType",
				name: "value",
			},
			getFieldSchema,
			getFieldType,
			values,
			valuesRaw,
			parents,
		);
	});

	test("should redefine getFieldSchema", () => {
		const errorsSetter = vi.fn<ErrorsSetterArgs, any>(() => ({}));

		const parentGetFieldSchema = vi.fn(() => ({
			type: "testType",
			name: "value",
		}));

		const getFieldSchema = vi.fn();

		const createGetFieldSchema = vi.fn<
			Parameters<CreateGetFieldSchema<any, any, any, any, any>>,
			any
		>(() => getFieldSchema);

		const getFieldType = vi.fn().mockReturnValue({
			errorsSetter,
			createGetFieldSchema,
		});

		setFieldErrors(
			setError,
			{
				value: "error",
			},

			["value"],

			parentGetFieldSchema,

			getFieldType,

			{},

			{
				value: "test",
			},

			parents,
		);

		expect(errorsSetter.mock.calls.length).toBe(1);
		expect(errorsSetter.mock.calls[0][4]).toBe(getFieldSchema);

		expect(createGetFieldSchema).toHaveBeenCalledTimes(1);
		expect(createGetFieldSchema).toHaveBeenCalledWith(
			{
				type: "testType",
				name: "value",
			},
			parentGetFieldSchema,
			getFieldType,
			{
				value: "test",
			},
			"serialize",
			parents,
		);
	});
});
