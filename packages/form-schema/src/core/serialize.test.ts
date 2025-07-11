import { afterEach, describe, expect, test, vi } from "vitest";
import type { BaseFieldSchema } from "../fields/base";
import { defaultSerializer, serialize } from "./serialize";
import type {
	CreateGetFieldSchema,
	FieldType,
	GetFieldSchema,
	GetFieldType,
	ParentType,
	Serializer,
} from "./types";

const parents: ParentType[] = [
	{
		values: {},
	},
];

describe("defaultSerializer", () => {
	test("get value by name", async () => {
		const result = await defaultSerializer({
			value: "error1",
			values: {
				foo: "error1",
				bar: "error2",
			},
			name: "foo",
			fieldSchema: null,
			getFieldSchema: vi.fn(),
			getFieldType: vi.fn(),
			parents: [],
			dependencies: undefined,
		});

		expect(result).toEqual({
			foo: "error1",
		});
	});

	test("return an empty object if there is no value by name", async () => {
		const result = await defaultSerializer({
			value: undefined,
			values: {
				bar: "error2",
			},
			name: "foo",
			fieldSchema: null,
			getFieldSchema: vi.fn(),
			getFieldType: vi.fn(),
			parents: [],
			dependencies: undefined,
		});

		expect(result).toEqual({});
	});
});

describe("serialize", () => {
	test("should call default serializer", async () => {
		const result = await serialize({
			values: {
				value: "test",
				value2: "test2",
			},

			names: ["value"],

			getFieldSchema: (): any => ({
				type: "testType",
				name: "value",
			}),

			getFieldType: () => ({}),

			parents,
		});

		expect(result).toEqual({
			value: "test",
		});
	});

	test("should call redefined serializer of the type of the field", async () => {
		const rawValues = {
			value: "test",
			value2: "test2",
		};

		const serializer = vi.fn<Serializer<any, any, any, any, any>>(
			({ values, name }) => ({
				[name]: values[name] + values[name],
			}),
		);

		const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
			serializer,
		});

		const fieldSchema = {
			type: "testType",
			name: "value",
		};

		const getFieldSchema: GetFieldSchema<any> = () => fieldSchema;

		const result = await serialize({
			values: rawValues,

			names: ["value"],

			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(result).toEqual({
			value: "testtest",
		});

		expect(serializer).toHaveBeenCalledTimes(1);
		expect(serializer).toHaveBeenCalledWith({
			value: "test",
			values: rawValues,
			name: "value",
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
		});
	});

	test("should call redefined serializer of the schema of the field", async () => {
		const rawValues = {
			value: "test",
			value2: "test2",
		};

		const serializer = vi.fn();
		const schemaSerializer = vi.fn<Serializer<any, any, any, any, any>>(
			({ values, name }) => ({
				[name]: values[name] + values[name],
			}),
		);

		const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
			serializer,
		});

		const fieldSchema = {
			type: "testType",
			name: "value",
			serializer: schemaSerializer,
		};

		const getFieldSchema: GetFieldSchema<any> = () => fieldSchema;

		const result = await serialize({
			values: rawValues,

			names: ["value"],

			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(result).toEqual({
			value: "testtest",
		});

		expect(serializer).toHaveBeenCalledTimes(0);

		expect(schemaSerializer).toHaveBeenCalledTimes(1);
		expect(schemaSerializer).toHaveBeenCalledWith({
			value: "test",
			values: rawValues,
			name: "value",
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
		});
	});

	test("should call single serializer of the type of the field", async () => {
		const rawValues = {
			value: "test",
			value2: "test2",
		};

		const serializerSingle = vi.fn().mockReturnValue("serialized single");
		const serializer = vi.fn();

		const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
			serializer,
			serializerSingle,
		});

		const fieldSchema = {
			type: "testType",
			name: "value",
		};

		const getFieldSchema: GetFieldSchema<any> = () => fieldSchema;

		const result = await serialize({
			values: rawValues,

			names: ["value"],

			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(result).toEqual({
			value: "serialized single",
		});

		expect(serializer).toHaveBeenCalledTimes(0);

		expect(serializerSingle).toHaveBeenCalledTimes(1);
		expect(serializerSingle).toHaveBeenCalledWith({
			value: "test",
			values: rawValues,
			name: "value",
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
		});
	});

	test("should call single serializer of the schema of the field", async () => {
		const rawValues = {
			value: "test",
			value2: "test2",
		};

		const serializerSingle = vi.fn();
		const schemaSerializerSingle = vi.fn().mockReturnValue("serialized single");
		const serializer = vi.fn();

		const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
			serializer,
			serializerSingle,
		});

		const fieldSchema = {
			type: "testType",
			name: "value",
			serializerSingle: schemaSerializerSingle,
		};

		const getFieldSchema: GetFieldSchema<any> = () => fieldSchema;

		const result = await serialize({
			values: rawValues,

			names: ["value"],

			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(result).toEqual({
			value: "serialized single",
		});

		expect(serializer).toHaveBeenCalledTimes(0);
		expect(serializerSingle).toHaveBeenCalledTimes(0);

		expect(schemaSerializerSingle).toHaveBeenCalledTimes(1);
		expect(schemaSerializerSingle).toHaveBeenCalledWith({
			value: "test",
			values: rawValues,
			name: "value",
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
		});
	});

	test("should call multiple serializers", async () => {
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
			testType1: {},
			testType2: {
				serializer: ({ values, name }) => ({
					[name]: values[name] + values[name],
				}),
			},
		};

		const result = await serialize({
			values: {
				value1: "test1",
				value2: "test2",
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

			parents,
		});

		expect(result).toEqual({
			value1: "test1",
			value2: "test2test2",
		});
	});

	test("should redefine getFieldSchema", async () => {
		const serializer = vi.fn<Serializer<any, any, any, any, any>>(() => ({}));

		const parentGetFieldSchema = vi.fn(() => ({
			type: "testType",
			name: "value",
		}));

		const getFieldSchema = vi.fn();

		const createGetFieldSchema = vi
			.fn<CreateGetFieldSchema<any, any, any, any, any>>()
			.mockReturnValue(getFieldSchema);

		const getFieldType = vi.fn().mockReturnValue({
			serializer,
			createGetFieldSchema,
		});

		await serialize({
			values: {
				value: "test",
			},

			names: ["value"],

			getFieldSchema: parentGetFieldSchema,
			getFieldType,
			parents,
		});

		expect(serializer).toHaveBeenCalledTimes(1);
		expect(serializer.mock.calls[0][0].getFieldSchema).toBe(getFieldSchema);

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

	test("multiple serializer", async () => {
		const serializer = vi.fn().mockImplementation(({ name, value }) =>
			Promise.resolve({
				[name]: `${value}${value}`,
			}),
		);

		const fieldSchema = {
			getDependencies,
			serializer,
		} satisfies BaseFieldSchema<unknown, unknown>;

		const getFieldSchema = vi.fn().mockReturnValue(fieldSchema);

		const values = {
			value1: "test1",
			value2: "test2",
			value3: "test3",
		};

		const result = await serialize({
			values,
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

		expect(serializer).toHaveBeenCalledWith({
			fieldSchema,
			dependencies,
			values,
			value: "test1",
			name: "value1",
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(result).toEqual({
			value1: "test1test1",
		});
	});

	test("single serializer", async () => {
		const serializerSingle = vi
			.fn()
			.mockImplementation(({ value }) => Promise.resolve(`${value}${value}`));

		const fieldSchema = {
			getDependencies,
			serializerSingle,
		} satisfies BaseFieldSchema<unknown, unknown>;

		const getFieldSchema = vi.fn().mockReturnValue(fieldSchema);

		const values = {
			value1: "test1",
			value2: "test2",
			value3: "test3",
		};

		const result = await serialize({
			values,
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

		expect(serializerSingle).toHaveBeenCalledWith({
			fieldSchema,
			dependencies,
			values,
			value: "test1",
			name: "value1",
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(result).toEqual({
			value1: "test1test1",
		});
	});
});
