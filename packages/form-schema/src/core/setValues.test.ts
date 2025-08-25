import { afterEach, describe, expect, test, vi } from "vitest";
import type { BaseFieldSchema } from "../fields/base";
import { defaultValueSetter, setValues } from "./setValues";
import type { CreateGetFieldSchema, ParentType, ValueSetter } from "./types";

const parents: ParentType[] = [
	{
		values: {},
	},
];

const getFieldType = () => ({});

const dependencies = Symbol("dependencies");

afterEach(() => {
	vi.clearAllMocks();
});

describe("defaultValueSetter", () => {
	test("not set undefined", () => {
		const setValue = vi.fn();

		defaultValueSetter({
			setValue,
			getFieldSchema: () => ({}),
			getFieldType,
			value: undefined,
			name: "test",
			dependencies,
			fieldSchema: {},
			parents,
			values: {},
		});

		expect(setValue).not.toHaveBeenCalled();
	});

	test("set value without parents", () => {
		const setValue = vi.fn();

		defaultValueSetter({
			setValue,
			getFieldSchema: () => ({}),
			getFieldType,
			value: "value",
			name: "test",
			dependencies,
			fieldSchema: {},
			parents,
			values: {},
		});

		expect(setValue).toHaveBeenCalledTimes(1);
		expect(setValue).toHaveBeenCalledWith("test", "value");
	});

	test("set value with parents", () => {
		const setValue = vi.fn();

		defaultValueSetter({
			setValue,
			getFieldSchema: () => ({}),
			getFieldType,
			value: "value",
			name: "test",
			dependencies,
			fieldSchema: {},
			parents: [
				{
					values: {},
				},
				{
					name: "parent",
					values: [],
				},
				{
					name: 1,
					values: {},
				},
			],
			values: {},
		});

		expect(setValue).toHaveBeenCalledTimes(1);
		expect(setValue).toHaveBeenCalledWith("parent.1.test", "value");
	});
});

describe("setValues", () => {
	test("use default setter", async () => {
		const setValue = vi.fn();

		await setValues({
			setValue,
			getFieldSchema: () => ({}),
			getFieldType,
			names: ["test"],
			parents,
			values: {
				test: "value",
			},
		});

		expect(setValue).toHaveBeenCalledTimes(1);
		expect(setValue).toHaveBeenCalledWith("test", "value");
	});

	test("set by field type", async () => {
		const setValue = vi.fn();

		await setValues({
			setValue,
			getFieldSchema: () => ({}),
			getFieldType: () => ({
				valueSetter: (valueSetterParams) => {
					valueSetterParams.setValue(
						String(valueSetterParams.name),
						`type_setter_${valueSetterParams.value}`,
					);
				},
			}),
			names: ["test"],
			parents,
			values: {
				test: "value",
			},
		});

		expect(setValue).toHaveBeenCalledTimes(1);
		expect(setValue).toHaveBeenCalledWith("test", "type_setter_value");
	});

	test("set by field schema", async () => {
		const setValue = vi.fn();

		await setValues({
			setValue,
			getFieldSchema: () => ({
				valueSetter: (valueSetterParams) => {
					valueSetterParams.setValue(
						String(valueSetterParams.name),
						`schema_setter_${valueSetterParams.value}`,
					);
				},
			}),
			getFieldType: () => ({
				valueSetter: (valueSetterParams) => {
					valueSetterParams.setValue(
						String(valueSetterParams.name),
						`type_setter_${valueSetterParams.value}`,
					);
				},
			}),
			names: ["test"],
			parents,
			values: {
				test: "value",
			},
		});

		expect(setValue).toHaveBeenCalledTimes(1);
		expect(setValue).toHaveBeenCalledWith("test", "schema_setter_value");
	});

	test("set multiple values", async () => {
		const setValue = vi.fn();

		await setValues({
			setValue,
			getFieldSchema: () => ({}),
			getFieldType,
			names: ["test1", "test2"],
			parents,
			values: {
				test1: "value1",
				test2: "value2",
			},
		});

		expect(setValue).toHaveBeenCalledTimes(2);
		expect(setValue).toHaveBeenNthCalledWith(1, "test1", "value1");
		expect(setValue).toHaveBeenNthCalledWith(2, "test2", "value2");
	});
});

test("should redefine getFieldSchema", async () => {
	const valueSetter = vi.fn<ValueSetter<any, any, any, any, any>>(() => ({}));

	const parentGetFieldSchema = vi.fn(() => ({
		type: "testType",
		name: "value",
	}));

	const getFieldSchema = vi.fn();

	const createGetFieldSchema = vi
		.fn<CreateGetFieldSchema<any, any, any, any, any>>()
		.mockReturnValue(getFieldSchema);

	const getFieldType = vi.fn().mockReturnValue({
		valueSetter,
		createGetFieldSchema,
	});

	const setValue = () => {};
	2;

	await setValues({
		setValue,

		values: {
			value: "test",
		},

		names: ["value"],

		getFieldSchema: parentGetFieldSchema,
		getFieldType,
		parents,
	});

	expect(valueSetter).toHaveBeenCalledTimes(1);
	expect(valueSetter.mock.calls[0][0].getFieldSchema).toBe(getFieldSchema);

	expect(createGetFieldSchema).toHaveBeenCalledTimes(1);
	expect(createGetFieldSchema).toHaveBeenCalledWith({
		dependencies: undefined,
		fieldSchema: {
			type: "testType",
			name: "value",
		},
		getFieldSchema: parentGetFieldSchema,
		getFieldType,
		values: {
			value: "test",
		},
		phase: "render",
		parents,
	});
});

describe("getDependencies", () => {
	const dependencies = Symbol("dependencies");

	const getDependencies = vi.fn().mockReturnValue(dependencies);
	const getFieldType = vi.fn().mockReturnValue({});

	const setValue = () => {};

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("provide dependencies", async () => {
		const valueSetter = vi.fn();

		const fieldSchema = {
			getDependencies,
			valueSetter,
		} satisfies BaseFieldSchema<unknown, unknown>;

		const getFieldSchema = vi.fn().mockReturnValue(fieldSchema);

		const values = {
			value1: "test1",
			value2: "test2",
			value3: "test3",
		};

		await setValues({
			setValue,
			values,
			names: ["value1"],
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(getDependencies).toHaveBeenCalledTimes(1);
		expect(getDependencies).toHaveBeenCalledWith({
			values,
			phase: "render",
			getFieldSchema,
			getFieldType,
			parents,
		});

		expect(valueSetter).toHaveBeenCalledWith({
			setValue,
			fieldSchema,
			dependencies,
			values,
			value: "test1",
			name: "value1",
			getFieldSchema,
			getFieldType,
			parents,
		});
	});
});
