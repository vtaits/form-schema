import { afterEach, describe, expect, test, vi } from "vitest";
import type { BaseFieldSchema } from "../fields/base";
import { parseSingle } from "./parseSingle";
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

test("should return `null` for falsy values object", async () => {
	const result = await parseSingle({
		values: null,
		name: "value",
		getFieldSchema: defaultGetFieldSchema,
		getFieldType: (): FieldType<any, any, any, any, any> => ({}),
		parents,
	});

	expect(result).toBe(null);
});

test("should call default parser", async () => {
	const result = await parseSingle({
		values: {
			value: "test",
			value2: "test2",
		},
		name: "value",
		getFieldSchema: defaultGetFieldSchema,
		getFieldType: (): FieldType<any, any, any, any, any> => ({}),
		parents,
	});

	expect(result).toBe("test");
});

test("should call default parser for empty value", async () => {
	const result = await parseSingle({
		values: {
			value2: "test2",
		},
		name: "value",
		getFieldSchema: defaultGetFieldSchema,
		getFieldType: () => ({}),
		parents,
	});

	expect(result).toBe(null);
});

test("should call redefined parser of the type of the field", async () => {
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

	const result = await parseSingle({
		values: rawValues,
		name: "value",
		getFieldSchema: defaultGetFieldSchema,
		getFieldType,
		parents,
	});

	expect(result).toBe("testtest");

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

test("should call redefined parser of the schema of the field", async () => {
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

	const result = await parseSingle({
		values: rawValues,
		name: "value",
		getFieldSchema,
		getFieldType,
		parents,
	});

	expect(result).toBe("testtest");

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

test("should call single parser of the type of the field", async () => {
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

	const result = await parseSingle({
		values: rawValues,
		name: "value",
		getFieldSchema: defaultGetFieldSchema,
		getFieldType,
		parents,
	});

	expect(result).toBe("testtest");

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

test("should call single parser of the schema of the field", async () => {
	const rawValues: Values = {
		value: "test",
		value2: "test2",
	};

	const parserSingle = vi.fn();
	const schemaParserSingle = vi.fn().mockReturnValue("testtest");
	const parser = vi.fn();

	const fieldSchema = {
		parserSingle: schemaParserSingle,
	};

	const getFieldSchema = () => fieldSchema;

	const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
		parser,
		parserSingle,
	});

	const result = await parseSingle({
		values: rawValues,
		name: "value",
		getFieldSchema,
		getFieldType,
		parents,
	});

	expect(result).toBe("testtest");

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

test("should work correctly with multiple fields", async () => {
	const fields: Record<string, FieldType<any, any, any, any, any>> = {
		testType1: {},
		testType2: {
			parser: ({ values, name }) => ({
				[name]: values[name] + values[name],
			}),
		},
	};

	const result = await parseSingle({
		values: {
			value1: "test1",
			value2: "test2",
		},
		name: "value2",
		getFieldSchema: defaultGetFieldSchema,
		getFieldType: ({ type }) => fields[type],
		parents,
	});

	expect(result).toBe("test2test2");
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

	const result = await parseSingle({
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

	const result = await parseSingle({
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

	expect(result).toBe("test3test3");
});

test("should redefine getFieldSchema", async () => {
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

	await parseSingle({
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

describe("getDependencies", () => {
	const dependencies = Symbol("dependencies");

	const getDependencies = vi.fn().mockReturnValue(dependencies);
	const getFieldType = vi.fn().mockReturnValue({});

	afterEach(() => {
		getDependencies.mockClear();
		vi.clearAllMocks();
	});

	test("multiple parser", async () => {
		const parser = vi.fn().mockImplementation(({ name, value }) =>
			Promise.resolve({
				[name]: `${value}${value}`,
			}),
		);

		const fieldSchema = {
			getDependencies,
			parser,
		} satisfies BaseFieldSchema<unknown, unknown>;

		const getFieldSchema = vi.fn().mockReturnValue(fieldSchema);

		const values = {
			value1: "test1",
			value2: "test2",
			value3: "test3",
		};

		const result = await parseSingle({
			values,
			name: "value1",
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(getDependencies).toHaveBeenCalledTimes(1);
		expect(getDependencies).toHaveBeenCalledWith({
			values,
			phase: "parse",
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(parser).toHaveBeenCalledWith({
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

	test("single parser", async () => {
		const parserSingle = vi
			.fn()
			.mockImplementation(({ value }) => Promise.resolve(`${value}${value}`));

		const fieldSchema = {
			getDependencies,
			parserSingle,
		} satisfies BaseFieldSchema<unknown, unknown>;

		const getFieldSchema = vi.fn().mockReturnValue(fieldSchema);

		const values = {
			value1: "test1",
			value2: "test2",
			value3: "test3",
		};

		const result = await parseSingle({
			values,
			name: "value1",
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(getDependencies).toHaveBeenCalledTimes(1);
		expect(getDependencies).toHaveBeenCalledWith({
			values,
			phase: "parse",
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(parserSingle).toHaveBeenCalledWith({
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
