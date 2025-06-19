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

const fieldSchemas: Record<string | number | symbol, unknown> = {
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

const defaultGetFieldSchema: GetFieldSchema<any> = (name) => fieldSchemas[name];

test("should return empty object for falsy values object", () => {
	expect(
		parse({
			values: null,
			names: ["value"],
			getFieldSchema: defaultGetFieldSchema,
			getFieldType: (): FieldType<any, any, any, any, any> => ({}),
			parents,
		}),
	).toEqual({});
});

test("should call default parser", () => {
	expect(
		parse({
			values: {
				value: "test",
				value2: "test2",
			},
			names: ["value"],
			getFieldSchema: defaultGetFieldSchema,
			getFieldType: (): FieldType<any, any, any, any, any> => ({}),
			parents,
		}),
	).toEqual({
		value: "test",
	});
});

test("should call default parser for empty value", () => {
	expect(
		parse({
			values: {
				value2: "test2",
			},
			names: ["value"],
			getFieldSchema: defaultGetFieldSchema,
			getFieldType: () => ({}),
			parents,
		}),
	).toEqual({
		value: null,
	});
});

test("should call redefined parser of the type of the field", () => {
	const rawValues: Values = {
		value: "test",
		value2: "test2",
	};

	const parser = vi.fn().mockReturnValue({
		value: "testtest",
	});

	const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
		parser,
	});

	expect(
		parse({
			values: rawValues,
			names: ["value"],
			getFieldSchema: defaultGetFieldSchema,
			getFieldType,
			parents,
		}),
	).toEqual({
		value: "testtest",
	});

	expect(parser).toHaveBeenCalledTimes(1);
	expect(parser).toHaveBeenCalledWith({
		value: "test",
		values: rawValues,
		name: "value",
		fieldSchema: fieldSchemas.value,
		getFieldSchema: defaultGetFieldSchema,
		getFieldType,
		parents,
	});
});

test("should call redefined parser of the schema of the field", () => {
	const rawValues: Values = {
		value: "test",
		value2: "test2",
	};

	const parser = vi.fn();
	const schemaParser = vi.fn().mockReturnValue({
		value: "testtest",
	});

	const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
		parser,
	});

	const fieldSchema = {
		parser: schemaParser,
	};

	const getFieldSchema = () => fieldSchema;

	expect(
		parse({
			values: rawValues,
			names: ["value"],
			getFieldSchema,
			getFieldType,
			parents,
		}),
	).toEqual({
		value: "testtest",
	});

	expect(parser).toHaveBeenCalledTimes(0);

	expect(schemaParser).toHaveBeenCalledTimes(1);
	expect(schemaParser).toHaveBeenCalledWith({
		value: "test",
		values: rawValues,
		name: "value",
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	});
});

test("should call single parser of the type of the field", () => {
	const rawValues: Values = {
		value: "test",
		value2: "test2",
	};

	const parserSingle = vi.fn().mockReturnValue("testtest");
	const parser = vi.fn();

	const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
		parser,
		parserSingle,
	});

	expect(
		parse({
			values: rawValues,
			names: ["value"],
			getFieldSchema: defaultGetFieldSchema,
			getFieldType,
			parents,
		}),
	).toEqual({
		value: "testtest",
	});

	expect(parserSingle).toHaveBeenCalledTimes(1);
	expect(parserSingle).toHaveBeenCalledWith({
		value: "test",
		values: rawValues,
		name: "value",
		fieldSchema: fieldSchemas.value,
		getFieldSchema: defaultGetFieldSchema,
		getFieldType,
		parents,
	});

	expect(parser).toHaveBeenCalledTimes(0);
});

test("should call single parser of the schema of the field", () => {
	const rawValues: Values = {
		value: "test",
		value2: "test2",
	};

	const parserSingle = vi.fn();
	const schemaParserSingle = vi.fn().mockReturnValue("testtest");
	const parser = vi.fn();

	const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
		parser,
		parserSingle,
	});

	const fieldSchema = {
		parserSingle: schemaParserSingle,
	};

	const getFieldSchema = () => fieldSchema;

	expect(
		parse({
			values: rawValues,
			names: ["value"],
			getFieldSchema,
			getFieldType,
			parents,
		}),
	).toEqual({
		value: "testtest",
	});

	expect(parserSingle).toHaveBeenCalledTimes(0);

	expect(schemaParserSingle).toHaveBeenCalledTimes(1);
	expect(schemaParserSingle).toHaveBeenCalledWith({
		value: "test",
		values: rawValues,
		name: "value",
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	});

	expect(parser).toHaveBeenCalledTimes(0);
});

test("should call multiple parsers", () => {
	const fields: Record<string, FieldType<any, any, any, any, any>> = {
		testType1: {},
		testType2: {
			parser: ({ values, name }) => ({
				[name]: values[name] + values[name],
			}),
		},
	};

	expect(
		parse({
			values: {
				value1: "test1",
				value2: "test2",
			},
			names: ["value1", "value2"],
			getFieldSchema: defaultGetFieldSchema,
			getFieldType: ({ type }) => fields[type],
			parents,
		}),
	).toEqual({
		value1: "test1",
		value2: "test2test2",
	});
});

test("should work with async parser", async () => {
	const fields: Record<string, FieldType<any, any, any, any, any>> = {
		testType1: {},

		testType2: {
			parser: ({ values, name }) => ({
				[name]: values[name] + values[name],
			}),
		},

		testType3: {
			parser: async ({ values, name }) => ({
				[name]: values[name] + values[name],
			}),
		},
	};

	const parseResult = parse({
		values: {
			value1: "test1",
			value2: "test2",
			value3: "test3",
		},
		names: ["value1", "value2", "value3"],
		getFieldSchema: defaultGetFieldSchema,
		getFieldType: ({ type }) => fields[type],
		parents,
	});

	expect(isPromise(parseResult)).toBe(true);

	const result = await parseResult;

	expect(result).toEqual({
		value1: "test1",
		value2: "test2test2",
		value3: "test3test3",
	});
});

test("should work with async single parser", async () => {
	const fields: Record<string, FieldType<any, any, any, any, any>> = {
		testType1: {},

		testType2: {
			parser: ({ values, name }) => ({
				[name]: values[name] + values[name],
			}),
		},

		testType3: {
			parserSingle: ({ value }) => Promise.resolve(`${value}${value}`),
		},
	};

	const parseResult = parse({
		values: {
			value1: "test1",
			value2: "test2",
			value3: "test3",
		},
		names: ["value1", "value2", "value3"],
		getFieldSchema: defaultGetFieldSchema,
		getFieldType: ({ type }) => fields[type],
		parents,
	});

	expect(isPromise(parseResult)).toBe(true);

	const result = await parseResult;

	expect(result).toEqual({
		value1: "test1",
		value2: "test2test2",
		value3: "test3test3",
	});
});

test("should redefine getFieldSchema", () => {
	const parser = vi.fn<Parser<any, any, any, any, any>>(() => ({}));

	const parentGetFieldSchema = vi.fn(() => ({
		type: "testType",
		name: "value",
	}));

	const getFieldSchema = vi.fn();

	const createGetFieldSchema = vi
		.fn<CreateGetFieldSchema<any, any, any, any, any>>()
		.mockReturnValue(getFieldSchema);

	const getFieldType = vi.fn().mockReturnValue({
		parser,
		createGetFieldSchema,
	});

	parse({
		values: {
			value: "test",
		},

		names: ["value"],

		getFieldSchema: parentGetFieldSchema,
		getFieldType,
		parents,
	});

	expect(parser).toHaveBeenCalledTimes(1);
	expect(parser.mock.calls[0][0].getFieldSchema).toBe(getFieldSchema);

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
		phase: "parse",
		parents,
	});
});
