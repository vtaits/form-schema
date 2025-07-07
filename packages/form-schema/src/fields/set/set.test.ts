import { afterEach, describe, expect, test, vi } from "vitest";

import {
	type BaseValues,
	type ParentType,
	parse,
	serialize,
	setFieldErrors,
	validateBeforeSubmit,
} from "../../core";
import type { SetSchema } from "./schema";
import { set } from "./set";

vi.mock("../../core");

const setError = vi.fn();
const setCurrentError = vi.fn();
const getFieldSchema = vi.fn();
const getFieldType = vi.fn();
const values = {
	foo: "bar",
};

const name = "test" as keyof BaseValues;

const valuesForNested = {
	[name]: values,
};

const parents: ParentType[] = [
	{
		values: {},
	},
];

const parentsForNested: ParentType[] = [
	{
		values: {},
	},
	{
		name,
		values,
	},
];

const fieldSchema: SetSchema<unknown> = {
	schemas: {
		field1: "SCHEMA_1",
		field2: "SCHEMA_2",
	},
};

const fieldSchemaNested: SetSchema<unknown> = {
	...fieldSchema,
	nested: true,
};

afterEach(() => {
	vi.resetAllMocks();
});

describe("createGetFieldSchema", () => {
	const { createGetFieldSchema } = set;

	if (!createGetFieldSchema) {
		throw new Error("`createGetFieldSchema` is not defined");
	}

	test("should return child schema by name", async () => {
		const getFieldSchema = await createGetFieldSchema({
			fieldSchema,
			getFieldSchema: vi.fn(),
			getFieldType: vi.fn(),
			parents: [],
			phase: "render",
			values: {},
			dependencies: undefined,
		});

		expect(getFieldSchema("field1")).toBe("SCHEMA_1");
	});
});

describe("serializer", () => {
	const { serializer } = set;

	if (!serializer) {
		throw new Error("`serializer` is not defined");
	}

	test("should return serialized values", async () => {
		const expectedResult = {
			bar: "baz",
		};

		vi.mocked(serialize).mockResolvedValue(expectedResult);

		const result = await serializer({
			name,
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
			value: undefined,
			values,
			dependencies: undefined,
		});

		expect(result).toBe(expectedResult);

		expect(serialize).toHaveBeenCalledTimes(1);
		expect(serialize).toHaveBeenCalledWith({
			names: ["field1", "field2"],
			getFieldSchema,
			getFieldType,
			parents,
			value: undefined,
			values,
		});
	});

	test("should return serialized values for nested field", async () => {
		const expectedResult = {
			bar: "baz",
		};

		vi.mocked(serialize).mockResolvedValue(expectedResult);

		const result = await serializer({
			name,
			fieldSchema: fieldSchemaNested,
			getFieldSchema,
			getFieldType,
			parents,
			value: values,
			values: valuesForNested,
			dependencies: undefined,
		});

		expect(result).toEqual({
			[name]: expectedResult,
		});

		expect(serialize).toHaveBeenCalledTimes(1);
		expect(serialize).toHaveBeenCalledWith({
			names: ["field1", "field2"],
			getFieldSchema,
			getFieldType,
			parents: parentsForNested,
			values,
		});
	});
});

describe("parser", () => {
	const { parser } = set;

	if (!parser) {
		throw new Error("`parser` is not defined");
	}

	test("should return parsed values", async () => {
		const expectedResult = {
			bar: "baz",
		};

		vi.mocked(parse).mockResolvedValue(expectedResult);

		const result = await parser({
			name,
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
			value: undefined,
			values,
			dependencies: undefined,
		});

		expect(result).toBe(expectedResult);

		expect(parse).toHaveBeenCalledTimes(1);
		expect(parse).toHaveBeenCalledWith({
			names: ["field1", "field2"],
			getFieldSchema,
			getFieldType,
			parents,
			values,
		});
	});

	test("should return parsed values for nested field", async () => {
		const expectedResult = {
			bar: "baz",
		};

		vi.mocked(parse).mockResolvedValue(expectedResult);

		const result = await parser({
			name,
			fieldSchema: fieldSchemaNested,
			getFieldSchema,
			getFieldType,
			parents,
			value: values,
			values: valuesForNested,
			dependencies: undefined,
		});

		expect(result).toEqual({
			[name]: expectedResult,
		});

		expect(parse).toHaveBeenCalledTimes(1);
		expect(parse).toHaveBeenCalledWith({
			names: ["field1", "field2"],
			getFieldSchema,
			getFieldType,
			parents: parentsForNested,
			values,
		});
	});
});

describe("validatorBeforeSubmit", () => {
	const { validatorBeforeSubmit } = set;

	if (!validatorBeforeSubmit) {
		throw new Error("`validatorBeforeSubmit` is not defined");
	}

	test("should validate all childs", async () => {
		await validatorBeforeSubmit({
			name,
			setError,
			setCurrentError,
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
			value: undefined,
			values,
			dependencies: undefined,
		});

		expect(validateBeforeSubmit).toHaveBeenCalledTimes(1);
		expect(validateBeforeSubmit).toHaveBeenCalledWith({
			names: ["field1", "field2"],
			setError,
			getFieldSchema,
			getFieldType,
			parents,
			values,
		});
	});

	test("should validate all childs for nested field", async () => {
		await validatorBeforeSubmit({
			name,
			setError,
			setCurrentError,
			fieldSchema: fieldSchemaNested,
			getFieldSchema,
			getFieldType,
			parents,
			value: values,
			values: valuesForNested,
			dependencies: undefined,
		});

		expect(validateBeforeSubmit).toHaveBeenCalledTimes(1);
		expect(validateBeforeSubmit).toHaveBeenCalledWith({
			names: ["field1", "field2"],
			setError,
			getFieldSchema,
			getFieldType,
			parents: parentsForNested,
			values,
		});
	});
});

describe("errorsSetter", () => {
	const { errorsSetter } = set;

	if (!errorsSetter) {
		throw new Error("`errorsSetter` is not defined");
	}

	test("should set errors to all childs", async () => {
		const errors = {
			error: "message",
		};

		const rawValues = {
			raw: "value",
		};

		await errorsSetter({
			name,
			setError,
			setCurrentError,
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
			value: undefined,
			values,
			errors,
			rawValue: undefined,
			rawValues,
			dependencies: undefined,
		});

		expect(setFieldErrors).toHaveBeenCalledTimes(1);
		expect(setFieldErrors).toHaveBeenCalledWith({
			names: ["field1", "field2"],
			setError,
			getFieldSchema,
			getFieldType,
			parents,
			values,
			rawValues,
			errors,
		});
	});

	test("should set errors to all childs for nested field", async () => {
		const errors = {
			error: "message",
		};

		const rawValues = {
			raw: "value",
		};

		await errorsSetter({
			name,
			setError,
			setCurrentError,
			fieldSchema: fieldSchemaNested,
			getFieldSchema,
			getFieldType,
			parents,
			value: values,
			values: valuesForNested,
			errors: {
				[name]: errors,
			},
			rawValue: rawValues,
			rawValues: {
				[name]: rawValues,
			},
			dependencies: undefined,
		});

		expect(setFieldErrors).toHaveBeenCalledTimes(1);
		expect(setFieldErrors).toHaveBeenCalledWith({
			names: ["field1", "field2"],
			setError,
			getFieldSchema,
			getFieldType,
			parents: parentsForNested,
			values,
			rawValues,
			errors,
		});
	});
});
