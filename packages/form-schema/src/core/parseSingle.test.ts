import isPromise from "is-promise";
import { expect, test, vi } from "vitest";
import { parseSingle } from "./parseSingle";
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
		parseSingle({
			values: null,
			name: "value",
			getFieldSchema: defaultGetFieldSchema,
			getFieldType: (): FieldType<any, any, any, any, any> => ({}),
			parents,
		}),
	).toBe(null);
});

test("should call default parser", () => {
	expect(
		parseSingle({
			values: {
				value: "test",
				value2: "test2",
			},
			name: "value",
			getFieldSchema: defaultGetFieldSchema,
			getFieldType: (): FieldType<any, any, any, any, any> => ({}),
			parents,
		}),
	).toBe("test");
});

test("should call default parser for empty value", () => {
	expect(
		parseSingle({
			values: {
				value2: "test2",
			},
			name: "value",
			getFieldSchema: defaultGetFieldSchema,
			getFieldType: () => ({}),
			parents,
		}),
	).toBe(null);
});

test("should call redefined parser", () => {
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
		parseSingle({
			values: rawValues,
			name: "value",
			getFieldSchema: defaultGetFieldSchema,
			getFieldType,
			parents,
		}),
	).toBe("testtest");

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

test("should call single parser", () => {
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
		parseSingle({
			values: rawValues,
			name: "value",
			getFieldSchema: defaultGetFieldSchema,
			getFieldType,
			parents,
		}),
	).toBe("testtest");

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

test("should work correctly with multiple fields", () => {
	const fields: Record<string, FieldType<any, any, any, any, any>> = {
		testType1: {},
		testType2: {
			parser: ({ values, name }) => ({
				[name]: values[name] + values[name],
			}),
		},
	};

	expect(
		parseSingle({
			values: {
				value1: "test1",
				value2: "test2",
			},
			name: "value2",
			getFieldSchema: defaultGetFieldSchema,
			getFieldType: ({ type }) => fields[type],
			parents,
		}),
	).toBe("test2test2");
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

	const parseResult = parseSingle({
		values: {
			value1: "test1",
			value2: "test2",
			value3: "test3",
		},
		name: "value3",
		getFieldSchema: defaultGetFieldSchema,
		getFieldType: ({ type }) => fields[type],
		parents,
	});

	expect(isPromise(parseResult)).toBe(true);

	const result = await parseResult;

	expect(result).toBe("test3test3");
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

	const parseResult = parseSingle({
		values: {
			value1: "test1",
			value2: "test2",
			value3: "test3",
		},
		name: "value3",
		getFieldSchema: defaultGetFieldSchema,
		getFieldType: ({ type }) => fields[type],
		parents,
	});

	expect(isPromise(parseResult)).toBe(true);

	const result = await parseResult;

	expect(result).toBe("test3test3");
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

	parseSingle({
		values: {
			value: "test",
		},

		name: "value",

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
