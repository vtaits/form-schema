import isPromise from "is-promise";
import { expect, test, vi } from "vitest";

import { parse } from "./parse";
import type {
	CreateGetFieldSchema,
	FieldType,
	GetFieldSchema,
	GetFieldType,
	Parser,
} from "./types";

type Values = Record<string, any>;

type ParserArgs = Parameters<Parser<any, any, any, any, any>>;

const fieldSchemas: Record<string, unknown> = {
	value: {
		type: "testType",
	},

	value1: {
		type: "testType1",
	},

	value2: {
		type: "testType2",
	},

	value3: {
		type: "testType3",
	},
};

const parents = [
	{
		values: {},
	},
];

const defaultGetFieldSchema: GetFieldSchema<any> = (name: string) =>
	fieldSchemas[name];

test("should return null for falsy values object", () => {
	expect(
		parse(
			null,
			["value"],
			defaultGetFieldSchema,
			(): FieldType<any, any, any, any, any> => ({}),
			parents,
		),
	).toEqual(null);
});

test("should call default parser", () => {
	expect(
		parse(
			{
				value: "test",
				value2: "test2",
			},
			["value"],
			defaultGetFieldSchema,
			(): FieldType<any, any, any, any, any> => ({}),
			parents,
		),
	).toEqual({
		value: "test",
	});
});

test("should call default parser for empty value", () => {
	expect(
		parse(
			{
				value2: "test2",
			},
			["value"],
			defaultGetFieldSchema,
			() => ({}),
			parents,
		),
	).toEqual({
		value: null,
	});
});

test("should call redefined parser", () => {
	const rawValues: Values = {
		value: "test",
		value2: "test2",
	};

	const parser = vi.fn<ParserArgs, any>(
		(values: Values, name: string): Values => ({
			[name]: values[name] + values[name],
		}),
	);

	const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
		parser,
	});

	expect(
		parse(rawValues, ["value"], defaultGetFieldSchema, getFieldType, parents),
	).toEqual({
		value: "testtest",
	});

	expect(parser).toHaveBeenCalledTimes(1);
	expect(parser).toHaveBeenCalledWith(
		rawValues,
		"value",
		fieldSchemas.value,
		defaultGetFieldSchema,
		getFieldType,
		parents,
	);
});

test("should call multiple parsers", () => {
	const fields: Record<string, FieldType<any, any, any, any, any>> = {
		testType1: {},
		testType2: {
			parser: (values: Values, name: string): Values => ({
				[name]: values[name] + values[name],
			}),
		},
	};

	expect(
		parse(
			{
				value1: "test1",
				value2: "test2",
			},
			["value1", "value2"],
			defaultGetFieldSchema,
			({ type }) => fields[type],
			parents,
		),
	).toEqual({
		value1: "test1",
		value2: "test2test2",
	});
});

test("should work with async parser", async () => {
	const fields: Record<string, FieldType<any, any, any, any, any>> = {
		testType1: {},

		testType2: {
			parser: (values: Values, name: string): Values => ({
				[name]: values[name] + values[name],
			}),
		},

		testType3: {
			parser: async (values: Values, name: string): Promise<Values> => ({
				[name]: values[name] + values[name],
			}),
		},
	};

	const parseResult = parse(
		{
			value1: "test1",
			value2: "test2",
			value3: "test3",
		},
		["value1", "value2", "value3"],
		defaultGetFieldSchema,
		({ type }) => fields[type],
		parents,
	);

	expect(isPromise(parseResult)).toBe(true);

	const result = await parseResult;

	expect(result).toEqual({
		value1: "test1",
		value2: "test2test2",
		value3: "test3test3",
	});
});

test("should redefine getFieldSchema", () => {
	const parser = vi.fn<ParserArgs, any>(() => ({}));

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
		parser,
		createGetFieldSchema,
	});

	parse(
		{
			value: "test",
		},

		["value"],

		parentGetFieldSchema,
		getFieldType,
		parents,
	);

	expect(parser).toHaveBeenCalledTimes(1);
	expect(parser.mock.calls[0][3]).toBe(getFieldSchema);

	expect(createGetFieldSchema.mock.calls[0][1]).toBe(parentGetFieldSchema);
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
		"parse",
		parents,
	);
});
