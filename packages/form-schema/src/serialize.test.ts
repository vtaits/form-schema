import { describe, expect, test, vi } from "vitest";

import { defaultSerializer, serialize } from "./serialize";
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

describe("defaultSerializer", () => {
	test("get value by name", () => {
		expect(
			defaultSerializer(
				{
					foo: "error1",
					bar: "error2",
				},
				"foo",
				null,
				vi.fn(),
				vi.fn(),
				[],
			),
		).toEqual({
			foo: "error1",
		});
	});

	test("return an empty object if there is no value by name", () => {
		expect(
			defaultSerializer(
				{
					bar: "error2",
				},
				"foo",
				null,
				vi.fn(),
				vi.fn(),
				[],
			),
		).toEqual({});
	});
});

describe("serialize", () => {
	test("should call default serializer", () => {
		expect(
			serialize(
				{
					value: "test",
					value2: "test2",
				},

				["value"],

				(): any => ({
					type: "testType",
					name: "value",
				}),

				() => ({}),

				parents,
			),
		).toEqual({
			value: "test",
		});
	});

	test("should call redefined serializer", () => {
		const rawValues = {
			value: "test",
			value2: "test2",
		};

		const serializer = vi.fn<SerializerArgs, any>(
			(values: Values, name: string): Values => ({
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

		expect(
			serialize(
				rawValues,

				["value"],

				getFieldSchema,
				getFieldType,
				parents,
			),
		).toEqual({
			value: "testtest",
		});

		expect(serializer).toHaveBeenCalledTimes(1);
		expect(serializer).toHaveBeenCalledWith(
			rawValues,
			"value",
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
		);
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
				serializer: (values: Values, name: string): Values => ({
					[name]: values[name] + values[name],
				}),
			},
		};

		expect(
			serialize(
				{
					value1: "test1",
					value2: "test2",
				},

				["value1", "value2"],

				(name): any => ({
					...fields[name],
					name,
				}),

				({ type }: { type: string }): FieldType<any, any, any, any, any> =>
					fieldTypes[type],

				parents,
			),
		).toEqual({
			value1: "test1",
			value2: "test2test2",
		});
	});

	test("should redefine getFieldSchema", () => {
		const serializer = vi.fn<SerializerArgs, any>(() => ({}));

		const parentGetFieldSchema = vi.fn(() => ({
			type: "testType",
			name: "value",
		}));

		const getFieldSchema = vi.fn();

		const createGetFieldSchema = vi
			.fn<Parameters<CreateGetFieldSchema<any, any, any, any, any>>, any>()
			.mockReturnValue(getFieldSchema);

		const getFieldType = vi.fn().mockReturnValue({
			serializer,
			createGetFieldSchema,
		});

		serialize(
			{
				value: "test",
			},

			["value"],

			parentGetFieldSchema,
			getFieldType,
			parents,
		);

		expect(serializer).toHaveBeenCalledTimes(1);
		expect(serializer.mock.calls[0][3]).toBe(getFieldSchema);

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
