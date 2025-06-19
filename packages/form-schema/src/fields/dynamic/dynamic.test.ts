import { describe, expect, test, vi } from "vitest";

import type { ParentType } from "../../core";
import { createGetFieldSchema, dynamic } from "./dynamic";

const childSchema = {
	foo: "bar",
};

const parents: ParentType[] = [
	{
		values: {},
	},
];

describe("createGetFieldSchema", () => {
	const getFieldSchema = vi.fn();
	const defaultGetFieldType = () => ({});

	test("should provide correct arguments to `getSchema`", () => {
		const getSchema = vi.fn();

		const values = {
			field1: "value1",
		};

		createGetFieldSchema({
			fieldSchema: { getSchema },
			getFieldSchema,
			getFieldType: defaultGetFieldType,
			values,
			phase: "render",
			parents,
		});

		expect(getSchema).toHaveBeenCalledTimes(1);
		expect(getSchema).toHaveBeenCalledWith(
			values,
			"render",
			getFieldSchema,
			defaultGetFieldType,
			parents,
		);
	});

	test("should return parent `getFieldSchema` if `getSchema` returns falsy value", () => {
		const getSchema = vi.fn();

		const result = createGetFieldSchema({
			fieldSchema: { getSchema },
			getFieldSchema,
			getFieldType: defaultGetFieldType,
			values: {},
			phase: "render",
			parents,
		});

		expect(result).toBe(getFieldSchema);
	});

	test("should return result of `getSchema` if `getSchema` returns truthy value", () => {
		const result = createGetFieldSchema({
			fieldSchema: {
				getSchema: () => childSchema,
			},
			getFieldSchema,
			getFieldType: defaultGetFieldType,
			values: {},
			phase: "render",
			parents,
		});

		expect(result("test")).toBe(childSchema);
	});
});

describe("serializer", () => {
	const getFieldSchema = vi.fn();
	const defaultGetFieldType = vi.fn();

	const { serializer } = dynamic;

	if (!serializer) {
		throw new Error("`serializer` is not defined");
	}

	test("should provide all values to `getSchema`", () => {
		const getSchema = vi.fn();

		const values = {
			field1: "value1",
		};

		serializer({
			value: null,
			values,
			name: "test",
			fieldSchema: { getSchema },
			getFieldSchema,
			getFieldType: defaultGetFieldType,
			parents,
		});

		expect(getSchema).toHaveBeenCalledTimes(1);
		expect(getSchema).toHaveBeenCalledWith(
			values,
			"serialize",
			getFieldSchema,
			defaultGetFieldType,
			parents,
		);
	});

	test("should return empty object if `getSchema` returns falsy value", () => {
		const values = {
			field1: "value1",
		};

		const result = serializer({
			value: null,
			values,
			name: "test",
			fieldSchema: {
				getSchema: () => null,
			},
			getFieldSchema,
			getFieldType: defaultGetFieldType,
			parents,
		});

		expect(result).toEqual({});
	});

	test("should call `getFieldType` with correct argument", () => {
		getFieldSchema.mockReturnValue(childSchema);

		const getFieldType = vi.fn().mockReturnValue({});

		const values = {
			field1: "value1",
		};

		serializer({
			value: null,
			values,
			name: "test",
			fieldSchema: {
				getSchema: () => childSchema,
			},
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(getFieldType).toHaveBeenCalledTimes(1);
		expect(getFieldType).toHaveBeenCalledWith(childSchema);
	});

	test("should call serializer of computed field type if defined", () => {
		getFieldSchema.mockReturnValue(childSchema);

		const fieldSerializer = vi.fn().mockReturnValue({
			field1: "serialized1",
		});

		const getFieldType = vi.fn().mockReturnValue({
			serializer: fieldSerializer,
		});

		const values = {
			field1: "value1",
		};

		const result = serializer({
			value: null,
			values,
			name: "test",
			fieldSchema: {
				getSchema: () => childSchema,
			},
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(result).toEqual({
			field1: "serialized1",
		});

		expect(fieldSerializer).toHaveBeenCalledWith({
			values,
			name: "test",
			fieldSchema: childSchema,
			getFieldSchema,
			getFieldType,
			parents,
		});
	});

	test("should call default serializer for computed field", () => {
		getFieldSchema.mockReturnValue(childSchema);

		const getFieldType = vi.fn().mockReturnValue({});

		const values = {
			field1: "value1",
			field2: "value2",
		};

		const result = serializer({
			value: null,
			values,
			name: "field1",
			fieldSchema: {
				getSchema: () => childSchema,
			},
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(result).toEqual({
			field1: "value1",
		});
	});
});

describe("parser", () => {
	const getFieldSchema = vi.fn();
	const defaultGetFieldType = vi.fn();

	const { parser } = dynamic;

	if (!parser) {
		throw new Error("`parser` is not defined");
	}

	describe("getSchema", () => {
		test("should provide all values to `getSchema`", () => {
			const getSchema = vi.fn();

			const values = {
				field1: "value1",
			};

			parser({
				value: null,
				values,
				name: "test",
				fieldSchema: { getSchema },
				getFieldSchema,
				getFieldType: defaultGetFieldType,
				parents,
			});

			expect(getSchema).toHaveBeenCalledTimes(1);
			expect(getSchema).toHaveBeenCalledWith(
				values,
				"parse",
				getFieldSchema,
				defaultGetFieldType,
				parents,
			);
		});

		test("should return empty object if `getSchema` returns falsy value", () => {
			const values = {
				field1: "value1",
			};

			const result = parser({
				value: null,
				values,
				name: "test",
				fieldSchema: {
					getSchema: () => null,
				},
				getFieldSchema,
				getFieldType: defaultGetFieldType,
				parents,
			});

			expect(result).toEqual({});
		});

		test("should call `getFieldType` with correct argument", () => {
			getFieldSchema.mockReturnValue(childSchema);

			const getFieldType = vi.fn().mockReturnValue({});

			const values = {
				field1: "value1",
			};

			parser({
				value: null,
				values,
				name: "test",
				fieldSchema: {
					getSchema: () => childSchema,
				},
				getFieldSchema,
				getFieldType,
				parents,
			});

			expect(getFieldType).toHaveBeenCalledTimes(1);
			expect(getFieldType).toHaveBeenCalledWith(childSchema);
		});

		test("should call parser of computed field type if defined", () => {
			getFieldSchema.mockReturnValue(childSchema);

			const fieldParser = vi.fn().mockReturnValue({
				field1: "parsed1",
			});

			const getFieldType = vi.fn().mockReturnValue({
				parser: fieldParser,
			});

			const values = {
				field1: "value1",
			};

			const result = parser({
				value: null,
				values,
				name: "test",
				fieldSchema: {
					getSchema: () => childSchema,
				},
				getFieldSchema,
				getFieldType,
				parents,
			});

			expect(result).toEqual({
				field1: "parsed1",
			});

			expect(fieldParser).toHaveBeenCalledWith({
				values,
				name: "test",
				fieldSchema: childSchema,
				getFieldSchema,
				getFieldType,
				parents,
			});
		});

		test("should call default parser for computed field", () => {
			const getFieldType = vi.fn().mockReturnValue({});

			const values = {
				field1: "value1",
				field2: "value2",
			};

			const result = parser({
				value: null,
				values,
				name: "field1",
				fieldSchema: {
					getSchema: () => "testSchema",
				},
				getFieldSchema,
				getFieldType,
				parents,
			});

			expect(result).toEqual({
				field1: "value1",
			});
		});
	});

	describe("getSchemaAsync", () => {
		test("should provide all values to `getSchemaAsync`", async () => {
			const getSchema = vi.fn();
			const getSchemaAsync = vi.fn().mockResolvedValue(null);

			const values = {
				field1: "value1",
			};

			await parser({
				value: null,
				values,
				name: "test",
				fieldSchema: {
					getSchemaAsync,
					getSchema,
				},
				getFieldSchema,
				getFieldType: defaultGetFieldType,
				parents,
			});

			expect(getSchemaAsync).toHaveBeenCalledTimes(1);
			expect(getSchemaAsync).toHaveBeenCalledWith(
				values,
				"parse",
				getFieldSchema,
				defaultGetFieldType,
				parents,
			);

			expect(getSchema).toHaveBeenCalledTimes(0);
		});

		test("should return empty object if `getSchemaAsync` returns falsy value", async () => {
			const getSchema = vi.fn().mockReturnValue("testSchemaSync");
			const getSchemaAsync = vi.fn().mockResolvedValue(null);

			const values = {
				field1: "value1",
			};

			const result = await parser({
				value: null,
				values,
				name: "test",
				fieldSchema: {
					getSchemaAsync,
					getSchema,
				},
				getFieldSchema,
				getFieldType: defaultGetFieldType,
				parents,
			});

			expect(result).toEqual({});
		});

		test("should call `getFieldType` with correct argument", async () => {
			getFieldSchema.mockReturnValue(childSchema);

			const getSchema = vi.fn().mockReturnValue("testSchemaSync");
			const getSchemaAsync = vi.fn().mockResolvedValue(childSchema);

			const getFieldType = vi.fn().mockReturnValue({});

			const values = {
				field1: "value1",
			};

			await parser({
				value: null,
				values,
				name: "test",
				fieldSchema: {
					getSchemaAsync,
					getSchema,
				},
				getFieldSchema,
				getFieldType,
				parents,
			});

			expect(getFieldType).toHaveBeenCalledTimes(1);
			expect(getFieldType).toHaveBeenCalledWith(childSchema);
		});

		test("should call parser of computed field type if defined", async () => {
			getFieldSchema.mockReturnValue(childSchema);

			const getSchema = vi.fn().mockReturnValue("testSchemaSync");
			const getSchemaAsync = vi.fn().mockResolvedValue(childSchema);

			const fieldParser = vi.fn().mockReturnValue({
				field1: "parsed1",
			});

			const getFieldType = vi.fn().mockReturnValue({
				parser: fieldParser,
			});

			const values = {
				field1: "value1",
			};

			const result = await parser({
				value: null,
				values,
				name: "test",
				fieldSchema: {
					getSchemaAsync,
					getSchema,
				},
				getFieldSchema,
				getFieldType,
				parents,
			});

			expect(result).toEqual({
				field1: "parsed1",
			});

			expect(fieldParser).toHaveBeenCalledWith({
				values,
				name: "test",
				fieldSchema: childSchema,
				getFieldSchema,
				getFieldType,
				parents,
			});
		});

		test("should call default parser for computed field", async () => {
			getFieldSchema.mockReturnValue(childSchema);

			const getSchema = vi.fn().mockReturnValue("testSchemaSync");
			const getSchemaAsync = vi.fn().mockResolvedValue(childSchema);

			const getFieldType = vi.fn().mockReturnValue({});

			const values = {
				field1: "value1",
				field2: "value2",
			};

			const result = await parser({
				value: null,
				values,
				name: "field1",
				fieldSchema: {
					getSchemaAsync,
					getSchema,
				},
				getFieldSchema,
				getFieldType,
				parents,
			});

			expect(getFieldType).toHaveBeenCalledTimes(1);
			expect(getFieldType).toHaveBeenCalledWith(childSchema);

			expect(result).toEqual({
				field1: "value1",
			});
		});
	});
});

describe("validatorBeforeSubmit", () => {
	const getFieldSchema = vi.fn();
	const defaultGetFieldType = vi.fn();
	const setError = vi.fn();
	const setCurrentError = vi.fn();

	const { validatorBeforeSubmit } = dynamic;

	if (!validatorBeforeSubmit) {
		throw new Error("`validatorBeforeSubmit` is not defined");
	}

	test("should provide all values to `getSchema`", () => {
		const getSchema = vi.fn();

		const values = {
			field1: "value1",
		};

		validatorBeforeSubmit({
			setError,
			setCurrentError,
			value: null,
			values,
			name: "test",
			fieldSchema: { getSchema },
			getFieldSchema,
			getFieldType: defaultGetFieldType,
			parents,
		});

		expect(getSchema).toHaveBeenCalledTimes(1);
		expect(getSchema).toHaveBeenCalledWith(
			values,
			"serialize",
			getFieldSchema,
			defaultGetFieldType,
			parents,
		);
	});

	test("should return empty object if `getSchema` returns falsy value", () => {
		const values = {
			field1: "value1",
		};

		const result = validatorBeforeSubmit({
			setError,
			setCurrentError,
			value: null,
			values,
			name: "test",
			fieldSchema: {
				getSchema: () => null,
			},
			getFieldSchema,
			getFieldType: defaultGetFieldType,
			parents,
		});

		expect(result).toEqual({});
	});

	test("should call `getFieldType` with correct argument", () => {
		getFieldSchema.mockReturnValue(childSchema);

		const getFieldType = vi.fn().mockReturnValue({});

		const values = {
			field1: "value1",
		};

		validatorBeforeSubmit({
			setError,
			setCurrentError,
			value: null,
			values,
			name: "test",
			fieldSchema: {
				getSchema: () => childSchema,
			},
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(getFieldType).toHaveBeenCalledTimes(1);
		expect(getFieldType).toHaveBeenCalledWith(childSchema);
	});

	test("should call `validatorBeforeSubmit` of computed field type if defined", () => {
		getFieldSchema.mockReturnValue(childSchema);

		const fieldValidatorBeforeSubmit = vi.fn();

		const getFieldType = vi.fn().mockReturnValue({
			validatorBeforeSubmit: fieldValidatorBeforeSubmit,
		});

		const values = {
			field1: "value1",
		};

		validatorBeforeSubmit({
			setError,
			setCurrentError,
			value: null,
			values,
			name: "test",
			fieldSchema: {
				getSchema: () => childSchema,
			},
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(fieldValidatorBeforeSubmit).toHaveBeenCalledWith({
			setError,
			setCurrentError: expect.any(Function),
			value: undefined,
			values,
			name: "test",
			fieldSchema: childSchema,
			getFieldSchema,
			getFieldType,
			parents,
		});
	});

	test("should not set any error if `validatorBeforeSubmit` for computed field is not defined", () => {
		getFieldSchema.mockReturnValue(childSchema);

		const getFieldType = vi.fn().mockReturnValue({});

		const values = {
			field1: "value1",
			field2: "value2",
		};

		const _result = validatorBeforeSubmit({
			setError,
			setCurrentError,
			value: null,
			values,
			name: "field1",
			fieldSchema: {
				getSchema: () => childSchema,
			},
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(setError).toHaveBeenCalledTimes(0);
	});
});

describe("errorsSetter", () => {
	const getFieldSchema = vi.fn();
	const defaultGetFieldType = vi.fn();
	const setError = vi.fn();
	const setCurrentError = vi.fn();

	const values = {
		field1: "value1",
	};

	const rawValues = {
		field1: "rawValue1",
	};

	const { errorsSetter } = dynamic;

	if (!errorsSetter) {
		throw new Error("`errorsSetter` is not defined");
	}

	test("should provide all errors to `getSchema`", () => {
		const getSchema = vi.fn();

		const errors = {
			field1: "error1",
		};

		errorsSetter({
			setError,
			setCurrentError,
			errors,
			name: "test",
			fieldSchema: { getSchema },
			getFieldSchema,
			getFieldType: defaultGetFieldType,
			value: null,
			values,
			rawValue: null,
			rawValues,
			parents,
		});

		expect(getSchema).toHaveBeenCalledTimes(1);
		expect(getSchema).toHaveBeenCalledWith(
			rawValues,
			"serialize",
			getFieldSchema,
			defaultGetFieldType,
			parents,
		);
	});

	test("should return empty object if `getSchema` returns falsy value", () => {
		const errors = {
			field1: "error1",
		};

		const result = errorsSetter({
			setError,
			setCurrentError,
			errors,
			name: "test",
			fieldSchema: {
				getSchema: () => null,
			},
			getFieldSchema,
			getFieldType: defaultGetFieldType,
			value: null,
			values,
			rawValue: null,
			rawValues,
			parents,
		});

		expect(result).toEqual({});
	});

	test("should call `getFieldType` with correct argument", () => {
		const getFieldType = vi.fn().mockReturnValue({});

		getFieldSchema.mockReturnValue(childSchema);

		const errors = {
			field1: "error1",
		};

		errorsSetter({
			setError,
			setCurrentError,
			errors,
			name: "test",
			fieldSchema: {
				getSchema: () => childSchema,
			},
			getFieldSchema,
			getFieldType,
			value: null,
			values,
			rawValue: null,
			rawValues,
			parents,
		});

		expect(getFieldType).toHaveBeenCalledTimes(1);
		expect(getFieldType).toHaveBeenCalledWith(childSchema);
	});

	test("should call errorsSetter of computed field type if defined", () => {
		const fieldErrorsSetter = vi.fn();

		const getFieldType = vi.fn().mockReturnValue({
			errorsSetter: fieldErrorsSetter,
		});

		const errors = {
			field1: "error1",
		};

		getFieldSchema.mockReturnValue(childSchema);

		errorsSetter({
			setError,
			setCurrentError,
			errors,
			name: "field1",
			fieldSchema: {
				getSchema: () => childSchema,
			},
			getFieldSchema,
			getFieldType,
			value: undefined,
			values,
			rawValue: undefined,
			rawValues,
			parents,
		});

		expect(fieldErrorsSetter).toHaveBeenCalledWith({
			setError,
			setCurrentError: expect.any(Function),
			errors,
			name: "field1",
			fieldSchema: childSchema,
			getFieldSchema,
			getFieldType,
			value: "value1",
			values,
			rawValue: "rawValue1",
			rawValues,
			parents,
		});
	});

	test("should call default errorsSetter for computed field", () => {
		const getFieldType = vi.fn().mockReturnValue({});

		const errors = {
			field1: "error1",
			field2: "error2",
		};

		errorsSetter({
			setError,
			setCurrentError,
			errors,
			name: "field1",
			fieldSchema: {
				getSchema: () => "testSchema",
			},
			getFieldSchema,
			getFieldType,
			value: null,
			values,
			rawValue: null,
			rawValues,
			parents,
		});

		expect(setError).toHaveBeenCalledTimes(1);
		expect(setError).toHaveBeenCalledWith("field1", parents, "error1");
	});
});
