import { afterEach, expect, test, vi } from "vitest";
import type {
	CreateGetFieldSchema,
	FieldType,
	GetFieldSchema,
	GetFieldType,
	ValidatorBeforeSubmit,
} from "./types";
import { validateBeforeSubmit } from "./validateBeforeSubmit";

type Values = Record<string, any>;

type ValidatorBeforeSubmitArgs = Parameters<
	ValidatorBeforeSubmit<any, any, any, any, any>
>;

const setError = vi.fn();

const parents = [
	{
		values: {},
	},
];

afterEach(() => {
	vi.clearAllMocks();
});

test("should call default validatorBeforeSubmit", () => {
	validateBeforeSubmit({
		setError,
		values: {
			value: "test",
			value2: "test2",
		},

		names: ["value"],

		getFieldSchema: (): any => ({
			type: "testType",
			name: "value",
		}),

		getFieldType: () => ({}),

		parents,
	});

	expect(setError).toHaveBeenCalledTimes(0);
});

test("should call redefined validatorBeforeSubmit", () => {
	const rawValues = {
		value: "test",
		value2: "test2",
	};

	const validatorBeforeSubmit = vi.fn<ValidatorBeforeSubmitArgs, any>(
		({
			setError,
			values,
			name,
			fieldSchema,
			getFieldSchema: computedGetFieldSchema,
			getFieldType,
			parents,
		}) => {
			setError(name, parents, values[name] + values[name]);
		},
	);

	const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
		validatorBeforeSubmit,
	});

	const fieldSchema = {
		type: "testType",
		name: "value",
	};

	const getFieldSchema: GetFieldSchema<any> = () => fieldSchema;

	validateBeforeSubmit({
		setError,
		values: rawValues,

		names: ["value"],

		getFieldSchema,
		getFieldType,
		parents,
	});

	expect(validatorBeforeSubmit).toHaveBeenCalledTimes(1);
	expect(validatorBeforeSubmit).toHaveBeenCalledWith({
		setError,
		value: "test",
		values: rawValues,
		name: "value",
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	});

	expect(setError).toHaveBeenCalledTimes(1);
	expect(setError).toHaveBeenNthCalledWith(1, "value", parents, "testtest");
});

test("should call multiple validators", () => {
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
		testType1: {
			validatorBeforeSubmit: ({ setError, values, name, parents }) => {
				setError(name, parents, values[name]);
			},
		},
		testType2: {
			validatorBeforeSubmit: ({ setError, values, name, parents }) => {
				setError(name, parents, values[name] + values[name]);
			},
		},
	};

	validateBeforeSubmit({
		setError,
		values: {
			value1: "test1",
			value2: "test2",
		},

		names: ["value1", "value2"],

		getFieldSchema: (name): any => ({
			...fields[name],
			name,
		}),

		getFieldType: ({
			type,
		}: { type: string }): FieldType<any, any, any, any, any> =>
			fieldTypes[type],

		parents,
	});

	expect(setError).toHaveBeenCalledTimes(2);
	expect(setError).toHaveBeenNthCalledWith(1, "value1", parents, "test1");
	expect(setError).toHaveBeenNthCalledWith(2, "value2", parents, "test2test2");
});

test("should redefine getFieldSchema", () => {
	const validatorBeforeSubmit = vi.fn<ValidatorBeforeSubmitArgs, any>(
		() => ({}),
	);

	const parentGetFieldSchema = vi.fn(() => ({
		type: "testType",
		name: "value",
	}));

	const getFieldSchema = vi.fn();

	const createGetFieldSchema = vi
		.fn<Parameters<CreateGetFieldSchema<any, any, any, any, any>>, any>()
		.mockReturnValue(getFieldSchema);

	const getFieldType = vi.fn().mockReturnValue({
		validatorBeforeSubmit,
		createGetFieldSchema,
	});

	validateBeforeSubmit({
		setError,
		values: {
			value: "test",
		},

		names: ["value"],

		getFieldSchema: parentGetFieldSchema,
		getFieldType,
		parents,
	});

	expect(validatorBeforeSubmit).toHaveBeenCalledTimes(1);
	expect(validatorBeforeSubmit.mock.calls[0][0].getFieldSchema).toBe(
		getFieldSchema,
	);

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
		phase: "serialize",
		parents,
	});
});
