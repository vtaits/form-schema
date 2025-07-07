import { afterEach, describe, expect, test, vi } from "vitest";
import type { BaseFieldSchema } from "../fields/base";
import { serializeSingle } from "./serializeSingle";
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

describe("serializeSingle", () => {
	test("should call default serializer", async () => {
		const result = await serializeSingle({
			values: {
				value: "test",
				value2: "test2",
			},

			name: "value",

			getFieldSchema: (): any => ({
				type: "testType",
				name: "value",
			}),

			getFieldType: () => ({}),

			parents,
		});

		expect(result).toBe("test");
	});

	test("should call redefined serializer of the type of the field", async () => {
		const rawValues = {
			value: "test",
			value2: "test2",
		};

		const serializer = vi.fn().mockReturnValue({
			value: "testtest",
		});

		const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
			serializer,
		});

		const fieldSchema = {
			type: "testType",
			name: "value",
		};

		const getFieldSchema: GetFieldSchema<any> = () => fieldSchema;

		const result = await serializeSingle({
			values: rawValues,
			name: "value",
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(result).toBe("testtest");

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

	test("should call redefined serializer of the type of schema field", async () => {
		const rawValues = {
			value: "test",
			value2: "test2",
		};

		const serializer = vi.fn();
		const schemaSerializer = vi.fn().mockReturnValue({
			value: "testtest",
		});

		const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
			serializer,
		});

		const fieldSchema = {
			type: "testType",
			name: "value",
			serializer: schemaSerializer,
		};

		const getFieldSchema: GetFieldSchema<any> = () => fieldSchema;

		const result = await serializeSingle({
			values: rawValues,
			name: "value",
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(result).toBe("testtest");

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

		const result = await serializeSingle({
			values: rawValues,

			name: "value",

			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(result).toBe("serialized single");

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
		const serializer = vi.fn();

		const schmaSerializerSingle = vi.fn().mockReturnValue("serialized single");

		const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
			serializer,
			serializerSingle,
		});

		const fieldSchema = {
			type: "testType",
			name: "value",
			serializerSingle: schmaSerializerSingle,
		};

		const getFieldSchema: GetFieldSchema<any> = () => fieldSchema;

		const result = await serializeSingle({
			values: rawValues,

			name: "value",

			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(result).toBe("serialized single");

		expect(serializer).toHaveBeenCalledTimes(0);
		expect(serializerSingle).toHaveBeenCalledTimes(0);

		expect(schmaSerializerSingle).toHaveBeenCalledTimes(1);
		expect(schmaSerializerSingle).toHaveBeenCalledWith({
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

		const result = await serializeSingle({
			values: {
				value1: "test1",
				value2: "test2",
			},

			name: "value1",

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

		expect(result).toBe("test1");
	});

	test("should redefine `getFieldSchema`", async () => {
		const serializer = vi.fn<Serializer<any, any, any, any, any>>(() => ({}));

		const parentGetFieldSchema = vi.fn().mockReturnValue({
			type: "testType",
			name: "value",
		});

		const getFieldSchema = vi.fn();

		const createGetFieldSchema = vi
			.fn<CreateGetFieldSchema<any, any, any, any, any>>()
			.mockReturnValue(getFieldSchema);

		const getFieldType = vi.fn().mockReturnValue({
			serializer,
			createGetFieldSchema,
		});

		await serializeSingle({
			values: {
				value: "test",
			},

			name: "value",
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

		const result = await serializeSingle({
			values,
			name: "value1",
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

		expect(result).toBe("test1test1");
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

		const result = await serializeSingle({
			values,
			name: "value1",
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

		expect(result).toBe("test1test1");
	});
});
