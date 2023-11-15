import { describe, expect, test, vi } from "vitest";

import type { ParentType } from "../../core";
import { createGetFieldSchema, dynamic } from "./dynamic";

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

	test("should return parent `getFieldSchema` if type of field not contains `createGetFieldSchema`", () => {
		const result = createGetFieldSchema({
			fieldSchema: {
				getSchema: () => ({}),
			},
			getFieldSchema,
			getFieldType: defaultGetFieldType,
			values: {},
			phase: "render",
			parents,
		});

		expect(result).toBe(getFieldSchema);
	});

	test("should return parent `getFieldSchema` if type of field not contains `createGetFieldSchema`", () => {
		const childGetFieldSchema = vi.fn();

		const childCreateGetFieldSchema = vi
			.fn()
			.mockReturnValue(childGetFieldSchema);

		const getFieldType = vi.fn().mockReturnValue({
			createGetFieldSchema: childCreateGetFieldSchema,
		});

		const testSchema = {
			type: "testType",
		};

		const values = {
			field1: "value1",
		};

		const result = createGetFieldSchema({
			fieldSchema: {
				getSchema: () => testSchema,
			},
			getFieldSchema,
			getFieldType,
			values,
			phase: "render",
			parents,
		});

		expect(result).toBe(childGetFieldSchema);

		expect(childCreateGetFieldSchema).toHaveBeenCalledTimes(1);
		expect(childCreateGetFieldSchema).toHaveBeenCalledWith({
			fieldSchema: testSchema,
			getFieldSchema,
			getFieldType,
			values,
			phase: "render",
			parents,
		});
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
		const getFieldType = vi.fn().mockReturnValue({});

		const values = {
			field1: "value1",
		};

		serializer({
			values,
			name: "test",
			fieldSchema: {
				getSchema: () => "testSchema",
			},
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(getFieldType).toHaveBeenCalledTimes(1);
		expect(getFieldType).toHaveBeenCalledWith("testSchema");
	});

	test("should call serializer of computed field type if defined", () => {
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
			values,
			name: "test",
			fieldSchema: {
				getSchema: () => "testSchema",
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
			fieldSchema: "testSchema",
			getFieldSchema,
			getFieldType,
			parents,
		});
	});

	test("should call default serializer for computed field", () => {
		const getFieldType = vi.fn().mockReturnValue({});

		const values = {
			field1: "value1",
			field2: "value2",
		};

		const result = serializer({
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
			const getFieldType = vi.fn().mockReturnValue({});

			const values = {
				field1: "value1",
			};

			parser({
				values,
				name: "test",
				fieldSchema: {
					getSchema: () => "testSchema",
				},
				getFieldSchema,
				getFieldType,
				parents,
			});

			expect(getFieldType).toHaveBeenCalledTimes(1);
			expect(getFieldType).toHaveBeenCalledWith("testSchema");
		});

		test("should call parser of computed field type if defined", () => {
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
				values,
				name: "test",
				fieldSchema: {
					getSchema: () => "testSchema",
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
				fieldSchema: "testSchema",
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
			const getSchema = vi.fn().mockReturnValue("testSchemaSync");
			const getSchemaAsync = vi.fn().mockResolvedValue("testSchema");

			const getFieldType = vi.fn().mockReturnValue({});

			const values = {
				field1: "value1",
			};

			await parser({
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
			expect(getFieldType).toHaveBeenCalledWith("testSchema");
		});

		test("should call parser of computed field type if defined", async () => {
			const getSchema = vi.fn().mockReturnValue("testSchemaSync");
			const getSchemaAsync = vi.fn().mockResolvedValue("testSchema");

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
				fieldSchema: "testSchema",
				getFieldSchema,
				getFieldType,
				parents,
			});
		});

		test("should call default parser for computed field", async () => {
			const getSchema = vi.fn().mockReturnValue("testSchemaSync");
			const getSchemaAsync = vi.fn().mockResolvedValue("testSchema");

			const getFieldType = vi.fn().mockReturnValue({});

			const values = {
				field1: "value1",
				field2: "value2",
			};

			const result = await parser({
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
			expect(getFieldType).toHaveBeenCalledWith("testSchema");

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
		const getFieldType = vi.fn().mockReturnValue({});

		const values = {
			field1: "value1",
		};

		validatorBeforeSubmit({
			setError,
			values,
			name: "test",
			fieldSchema: {
				getSchema: () => "testSchema",
			},
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(getFieldType).toHaveBeenCalledTimes(1);
		expect(getFieldType).toHaveBeenCalledWith("testSchema");
	});

	test("should call validatorBeforeSubmit of computed field type if defined", () => {
		const fieldValidatorBeforeSubmit = vi.fn().mockReturnValue({
			field1: "serialized1",
		});

		const getFieldType = vi.fn().mockReturnValue({
			validatorBeforeSubmit: fieldValidatorBeforeSubmit,
		});

		const values = {
			field1: "value1",
		};

		const result = validatorBeforeSubmit({
			setError,
			values,
			name: "test",
			fieldSchema: {
				getSchema: () => "testSchema",
			},
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(result).toEqual({
			field1: "serialized1",
		});

		expect(fieldValidatorBeforeSubmit).toHaveBeenCalledWith({
			setError,
			values,
			name: "test",
			fieldSchema: "testSchema",
			getFieldSchema,
			getFieldType,
			parents,
		});
	});

	test("should return empty object if validatorBeforeSubmit for computed field is not defined", () => {
		const getFieldType = vi.fn().mockReturnValue({});

		const values = {
			field1: "value1",
			field2: "value2",
		};

		const result = validatorBeforeSubmit({
			setError,
			values,
			name: "field1",
			fieldSchema: {
				getSchema: () => "testSchema",
			},
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(result).toEqual({});
	});
});

describe("errorsSetter", () => {
	const getFieldSchema = vi.fn();
	const defaultGetFieldType = vi.fn();
	const setError = vi.fn();

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
			errors,
			name: "test",
			fieldSchema: { getSchema },
			getFieldSchema,
			getFieldType: defaultGetFieldType,
			values,
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
			errors,
			name: "test",
			fieldSchema: {
				getSchema: () => null,
			},
			getFieldSchema,
			getFieldType: defaultGetFieldType,
			values,
			rawValues,
			parents,
		});

		expect(result).toEqual({});
	});

	test("should call `getFieldType` with correct argument", () => {
		const getFieldType = vi.fn().mockReturnValue({});

		const errors = {
			field1: "error1",
		};

		errorsSetter({
			setError,
			errors,
			name: "test",
			fieldSchema: {
				getSchema: () => "testSchema",
			},
			getFieldSchema,
			getFieldType,
			values,
			rawValues,
			parents,
		});

		expect(getFieldType).toHaveBeenCalledTimes(1);
		expect(getFieldType).toHaveBeenCalledWith("testSchema");
	});

	test("should call errorsSetter of computed field type if defined", () => {
		const fieldErrorsSetter = vi.fn().mockReturnValue({
			field1: "processed1",
		});

		const getFieldType = vi.fn().mockReturnValue({
			errorsSetter: fieldErrorsSetter,
		});

		const errors = {
			field1: "error1",
		};

		const result = errorsSetter({
			setError,
			errors,
			name: "test",
			fieldSchema: {
				getSchema: () => "testSchema",
			},
			getFieldSchema,
			getFieldType,
			values,
			rawValues,
			parents,
		});

		expect(result).toEqual({
			field1: "processed1",
		});

		expect(fieldErrorsSetter).toHaveBeenCalledWith({
			setError,
			errors,
			name: "test",
			fieldSchema: "testSchema",
			getFieldSchema,
			getFieldType,
			values,
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
			errors,
			name: "field1",
			fieldSchema: {
				getSchema: () => "testSchema",
			},
			getFieldSchema,
			getFieldType,
			values,
			rawValues,
			parents,
		});

		expect(setError).toHaveBeenCalledTimes(1);
		expect(setError).toHaveBeenCalledWith("field1", parents, "error1");
	});
});
