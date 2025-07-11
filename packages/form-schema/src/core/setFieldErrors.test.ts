import { afterEach, describe, expect, test, vi } from "vitest";
import type { BaseFieldSchema } from "../fields/base";
import { defaultFieldErrorsSetter, setFieldErrors } from "./setFieldErrors";
import type {
	CreateGetFieldSchema,
	ErrorsSetter,
	FieldType,
	GetFieldSchema,
	GetFieldType,
	NameType,
	ParentType,
} from "./types";

type Values = Record<string, any>;

const setError = vi.fn();
const setCurrentError = vi.fn();

const parents: ParentType[] = [
	{
		values: {},
	},
];

afterEach(() => {
	vi.clearAllMocks();
});

describe("defaultFieldErrorsSetter", () => {
	test("set error by name", async () => {
		await defaultFieldErrorsSetter({
			setError,
			setCurrentError,
			errors: {
				foo: "error1",
				bar: "error2",
			},
			name: "foo",
			fieldSchema: null,
			getFieldSchema: vi.fn(),
			getFieldType: vi.fn(),
			value: null,
			values: {},
			rawValue: null,
			rawValues: {},
			parents,
			dependencies: null,
		});

		expect(setError).toHaveBeenCalledTimes(1);
		expect(setError).toHaveBeenNthCalledWith(1, "foo", parents, "error1");
	});

	test("not set error if there is no error by name", async () => {
		await defaultFieldErrorsSetter({
			setError,
			setCurrentError,
			errors: {
				bar: "error2",
			},
			name: "foo",
			fieldSchema: null,
			getFieldSchema: vi.fn(),
			getFieldType: vi.fn(),
			value: null,
			values: {},
			rawValue: null,
			rawValues: {},
			parents,
			dependencies: null,
		});
		expect(setError).toHaveBeenCalledTimes(0);
	});
});

describe("setFieldErrors", () => {
	test("should call default errors mapper", async () => {
		await setFieldErrors({
			setError,
			errors: {
				value: ["test"],
				value2: ["test2"],
			},
			names: ["value"],
			getFieldSchema: (): any => ({
				type: "testType",
				name: "value",
			}),
			getFieldType: (): FieldType<any, any, any, any, any> => ({}),
			values: {},
			rawValues: {},
			parents,
		});

		expect(setError).toHaveBeenCalledTimes(1);
		expect(setError).toHaveBeenNthCalledWith(1, "value", parents, ["test"]);
	});

	test("should call redefined errors mapper with `setError`", async () => {
		await setFieldErrors({
			setError,
			errors: {
				value: ["test"],
				value2: ["test2"],
			} as Record<NameType, string[]>,
			names: ["value"],
			getFieldSchema: (): any => ({
				type: "testType",
				name: "value",
			}),
			getFieldType: () => ({
				errorsSetter: ({ setError: setErrorCb, errors, name, parents }) => {
					setErrorCb(name, parents, [errors[name][0] + errors[name][0]]);
				},
			}),
			values: {} as Record<string, unknown>,
			rawValues: {} as Record<string, unknown>,
			parents,
		});

		expect(setError).toHaveBeenCalledTimes(1);
		expect(setError).toHaveBeenNthCalledWith(1, "value", parents, ["testtest"]);
	});

	test("should call redefined errors mapper with `setCurrentError`", async () => {
		await setFieldErrors({
			setError,
			errors: {
				value: ["test"],
				value2: ["test2"],
			} as Record<NameType, string[]>,
			names: ["value"],
			getFieldSchema: (): any => ({
				type: "testType",
				name: "value",
			}),
			getFieldType: () => ({
				errorsSetter: ({ setCurrentError, errors, name }) => {
					setCurrentError([errors[name][0] + errors[name][0]]);
				},
			}),
			values: {} as Record<string, unknown>,
			rawValues: {} as Record<string, unknown>,
			parents,
		});

		expect(setError).toHaveBeenCalledTimes(1);
		expect(setError).toHaveBeenNthCalledWith(1, "value", parents, ["testtest"]);
	});

	test("should call multiple errors mappers", async () => {
		const fields: Record<
			string | number | symbol,
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
				errorsSetter: ({ setError: setErrorCb, errors, name, parents }) => {
					setErrorCb(name, parents, [
						errors[name][0] + errors[name][0] + errors[name][0],
					]);
				},
			},
			testType2: {
				errorsSetter: ({ setError: setErrorCb, errors, name, parents }) => {
					setErrorCb(name, parents, [errors[name][0] + errors[name][0]]);
				},
			},
		};

		await setFieldErrors({
			setError,
			errors: {
				value1: ["test1"],
				value2: ["test2"],
			},
			names: ["value1", "value2"],
			getFieldSchema: (name): any => ({
				...fields[name],
				name,
			}),
			getFieldType: ({
				type,
			}: {
				type: string;
			}): FieldType<any, any, any, any, any> => fieldTypes[type],
			values: {},
			rawValues: {},
			parents,
		});

		expect(setError).toHaveBeenCalledTimes(2);
		expect(setError).toHaveBeenNthCalledWith(1, "value1", parents, [
			"test1test1test1",
		]);
		expect(setError).toHaveBeenNthCalledWith(2, "value2", parents, [
			"test2test2",
		]);
	});

	test("should call multiple nested errors mappers", async () => {
		const fields: Record<
			string | number | symbol,
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
				errorsSetter: ({
					errors,
					fieldSchema: { childNames, childs },
					getFieldType,
				}) => {
					setFieldErrors({
						setError,
						errors: errors,
						names: childNames,
						getFieldSchema: (childName) => ({
							...childs[childName],
							name: childName,
						}),
						getFieldType,
						values: {},
						rawValues: {},
						parents,
					});
				},
			},

			testType1: {
				errorsSetter: ({ setError: setErrorCb, errors, name, parents }) => {
					setErrorCb(name, parents, [
						errors[name][0] + errors[name][0] + errors[name][0],
					]);
				},
			},

			testType2: {
				errorsSetter: ({ setError: setErrorCb, errors, name, parents }) => {
					setErrorCb(name, parents, [errors[name][0] + errors[name][0]]);
				},
			},
		};

		await setFieldErrors({
			setError,
			errors: {
				value1: ["test1"],
				value2: ["test2"],
				value3: ["test3"],
				value4: ["test4"],
			},

			names: ["wrapper1", "wrapper2"],

			getFieldSchema: (name): any => ({
				...fields[name],
				name,
			}),

			getFieldType: ({
				type,
			}: {
				type: string;
			}): FieldType<any, any, any, any, any> => fieldTypes[type],

			values: {},
			rawValues: {},
			parents,
		});

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

	test("should provide correct arguments to errorsSetter", async () => {
		const errorsSetter = vi.fn();

		const values: Values = {
			value: "testValue",
		};

		const rawValues: Values = {
			value: "testValueRaw",
		};

		const getFieldSchema: GetFieldSchema<any> = () => ({
			type: "testType",
			name: "value",
		});

		const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
			errorsSetter,
		});

		await setFieldErrors({
			setError,
			errors: {
				value: "test",
			},
			names: ["value"],
			getFieldSchema,
			getFieldType,
			values,
			rawValues,
			parents,
		});

		expect(errorsSetter).toHaveBeenCalledTimes(1);
		expect(errorsSetter).toHaveBeenCalledWith({
			setError,
			setCurrentError: expect.any(Function),
			errors: {
				value: "test",
			},
			name: "value",
			fieldSchema: {
				type: "testType",
				name: "value",
			},
			getFieldSchema,
			getFieldType,
			value: "testValue",
			values,
			rawValue: "testValueRaw",
			rawValues,
			parents,
		});
	});

	test("should redefine getFieldSchema", async () => {
		const errorsSetter = vi.fn<ErrorsSetter<any, any, any, any, any>>();

		const parentGetFieldSchema = vi.fn(() => ({
			type: "testType",
			name: "value",
		}));

		const getFieldSchema = vi.fn();

		const createGetFieldSchema = vi
			.fn<CreateGetFieldSchema<any, any, any, any, any>>()
			.mockReturnValue(getFieldSchema);

		const getFieldType = vi.fn().mockReturnValue({
			errorsSetter,
			createGetFieldSchema,
		});

		await setFieldErrors({
			setError,
			errors: {
				value: "error",
			},

			names: ["value"],

			getFieldSchema: parentGetFieldSchema,

			getFieldType: getFieldType,

			values: {} as Record<string, unknown>,

			rawValues: {
				value: "test",
			},

			parents,
		});

		expect(errorsSetter.mock.calls.length).toBe(1);
		expect(errorsSetter.mock.calls[0][0].getFieldSchema).toBe(getFieldSchema);

		expect(createGetFieldSchema).toHaveBeenCalledTimes(1);
		expect(createGetFieldSchema).toHaveBeenCalledWith({
			fieldSchema: {
				type: "testType",
				name: "value",
			},
			getFieldSchema: parentGetFieldSchema,
			getFieldType,
			values: {
				value: "test",
			},
			phase: "serialize",
			parents,
		});
	});
});

describe("getDependencies", () => {
	const dependencies = Symbol("dependencies");

	const getDependencies = vi.fn().mockReturnValue(dependencies);
	const getFieldType = vi.fn().mockReturnValue({});

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("provide dependencies", async () => {
		const errorsSetter = vi.fn().mockResolvedValue(undefined);

		const fieldSchema = {
			getDependencies,
			errorsSetter,
		} satisfies BaseFieldSchema<unknown, unknown>;

		const getFieldSchema = vi.fn().mockReturnValue(fieldSchema);

		const values = {
			value1: "test1",
			value2: "test2",
			value3: "test3",
		};

		const rawValues = {
			value: "test",
		};

		const errors = {
			value: "error",
		};

		await setFieldErrors({
			setError,
			errors,
			values,
			rawValues,
			names: ["value1"],
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(getDependencies).toHaveBeenCalledTimes(1);
		expect(getDependencies).toHaveBeenCalledWith({
			values,
			phase: "serialize",
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(errorsSetter).toHaveBeenCalledWith({
			errors,
			setError,
			fieldSchema,
			dependencies,
			values,
			value: "test1",
			rawValue: undefined,
			rawValues,
			name: "value1",
			getFieldSchema,
			getFieldType,
			parents,
			setCurrentError: expect.any(Function),
		});
	});
});
