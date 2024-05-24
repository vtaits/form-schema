import { describe, expect, test, vi } from "vitest";
import { serializeSingle } from "./serializeSingle";
import type {
	CreateGetFieldSchema,
	FieldType,
	GetFieldSchema,
	GetFieldType,
	Serializer,
} from "./types";

type Values = Record<string, any>;

type SerializerArgs = Parameters<Serializer<any, any, any, any, any>>;

const parents = [
	{
		values: {},
	},
];

describe("serializeSingle", () => {
	test("should call default serializer", () => {
		expect(
			serializeSingle({
				value: "test",

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
			}),
		).toBe("test");
	});

	test("should call redefined serializer", () => {
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

		expect(
			serializeSingle({
				value: "test",
				values: rawValues,
				name: "value",
				getFieldSchema,
				getFieldType,
				parents,
			}),
		).toBe("testtest");

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

	test("should call single serializer", () => {
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

		expect(
			serializeSingle({
				value: "test",
				values: rawValues,

				name: "value",

				getFieldSchema,
				getFieldType,
				parents,
			}),
		).toBe("serialized single");

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

	test("should call multiple serializers", () => {
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
			testType1: {},
			testType2: {
				serializer: ({ values, name }) => ({
					[name]: values[name] + values[name],
				}),
			},
		};

		expect(
			serializeSingle({
				value: "test1",
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
				}: { type: string }): FieldType<any, any, any, any, any> =>
					fieldTypes[type],

				parents,
			}),
		).toBe("test1");
	});

	test("should redefine getFieldSchema", () => {
		const serializer = vi.fn<SerializerArgs, any>(() => ({}));

		const parentGetFieldSchema = vi.fn().mockReturnValue({
			type: "testType",
			name: "value",
		});

		const getFieldSchema = vi.fn();

		const createGetFieldSchema = vi
			.fn<Parameters<CreateGetFieldSchema<any, any, any, any, any>>, any>()
			.mockReturnValue(getFieldSchema);

		const getFieldType = vi.fn().mockReturnValue({
			serializer,
			createGetFieldSchema,
		});

		serializeSingle({
			value: "test",
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
