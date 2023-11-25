import { afterEach, describe, expect, test, vi } from "vitest";

import {
	type ParentType,
	parse,
	serialize,
	setFieldErrors,
	validateBeforeSubmit,
} from "../../core";
import { SetSchema } from "./schema";
import { set } from "./set";

vi.mock("../../core");

const setError = vi.fn();
const getFieldSchema = vi.fn();
const getFieldType = vi.fn();
const values = {
	foo: "bar",
};

const parents: ParentType[] = [
	{
		values: {},
	},
];

const fieldSchema: SetSchema<unknown> = {
	schemas: {
		field1: "SCHEMA_1",
		field2: "SCHEMA_2",
	},
};

afterEach(() => {
	vi.resetAllMocks();
});

describe("createGetFieldSchema", () => {
	const { createGetFieldSchema } = set;

	if (!createGetFieldSchema) {
		throw new Error("`createGetFieldSchema` is not defined");
	}

	test("should return child schema by name", () => {
		const getFieldSchema = createGetFieldSchema({
			fieldSchema,
			getFieldSchema: vi.fn(),
			getFieldType: vi.fn(),
			parents: [],
			phase: "render",
			values: {},
		});

		expect(getFieldSchema("field1")).toBe("SCHEMA_1");
	});
});

describe("serializer", () => {
	const { serializer } = set;

	if (!serializer) {
		throw new Error("`serializer` is not defined");
	}

	test("should return serialized values", () => {
		const expectedResult = {
			bar: "baz",
		};

		vi.mocked(serialize).mockReturnValue(expectedResult);

		const result = serializer({
			name: "test",
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
			values,
		});

		expect(result).toBe(expectedResult);

		expect(serialize).toHaveBeenCalledTimes(1);
		expect(serialize).toHaveBeenCalledWith({
			names: ["field1", "field2"],
			getFieldSchema,
			getFieldType,
			parents,
			values,
		});
	});
});

describe("parser", () => {
	const { parser } = set;

	if (!parser) {
		throw new Error("`parser` is not defined");
	}

	test("should return parsed values", () => {
		const expectedResult = {
			bar: "baz",
		};

		vi.mocked(parse).mockReturnValue(expectedResult);

		const result = parser({
			name: "test",
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
			values,
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
});

describe("validatorBeforeSubmit", () => {
	const { validatorBeforeSubmit } = set;

	if (!validatorBeforeSubmit) {
		throw new Error("`validatorBeforeSubmit` is not defined");
	}

	test("should return validate add childs", () => {
		validatorBeforeSubmit({
			name: "test",
			setError,
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
			values,
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
});

describe("errorsSetter", () => {
	const { errorsSetter } = set;

	if (!errorsSetter) {
		throw new Error("`errorsSetter` is not defined");
	}

	test("should return set errors to all childs", () => {
		const errors = {
			error: "message",
		};

		const rawValues = {
			raw: "value",
		};

		errorsSetter({
			name: "test",
			setError,
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
			values,
			errors,
			rawValues,
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
});
