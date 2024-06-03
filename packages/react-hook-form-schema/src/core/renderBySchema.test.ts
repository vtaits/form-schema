import type { UseFormReturn } from "react-hook-form";
import { afterEach, describe, expect, test, vi } from "vitest";
import { renderBySchema } from "./renderBySchema";

const values = {
	foo: "bar",
};

const getValues = () => values;

const fieldSchema = "FIELD_SCHEMA";

const getFieldSchema = vi.fn();
const getFieldType = vi.fn();

const name = "NAME";
const payload = "PAYLOAD";
const renderResult = "RENDER_RESULT";

const formResult = {
	FORM_RESULT: true,
} as unknown as UseFormReturn<any, any, any>;

afterEach(() => {
	vi.resetAllMocks();
});

describe.each([
	{
		label: "default parents",
		parents: [
			{
				values: {},
			},
			{
				name: "container",
				values: {
					baz: "foo",
				},
			},
		],
		expectedParents: [
			{
				values: {},
			},
			{
				name: "container",
				values: {
					baz: "foo",
				},
			},
		],
		expectedFieldPath: "container.NAME",
	},
	{
		label: "provided parents",
		parents: undefined,
		expectedParents: [
			{
				values,
			},
		],
		expectedFieldPath: "NAME",
	},
])("$label", ({ parents, expectedFieldPath, expectedParents }) => {
	test("render with own `getFieldSchema`", () => {
		const render = vi.fn().mockReturnValue(renderResult);

		getFieldSchema.mockReturnValue(fieldSchema);
		getFieldType.mockReturnValue({
			render,
		});

		const result = renderBySchema(
			formResult,
			getFieldSchema,
			getFieldType,
			getValues,
			name,
			payload,
			parents,
		);

		expect(result).toBe(renderResult);

		expect(render).toHaveBeenCalledWith(
			{
				fieldPath: expectedFieldPath,
				name,
				payload,
				parents: expectedParents,
				getFieldSchema,
				getFieldType,
				fieldSchema,
			},
			formResult,
		);

		expect(getFieldType).toHaveBeenCalledTimes(1);
		expect(getFieldType).toHaveBeenCalledWith(fieldSchema);
	});

	test("render with computed `getFieldSchema`", () => {
		const render = vi.fn().mockReturnValue(renderResult);

		const providedGetFieldSchema = vi.fn();
		const createGetFieldSchema = vi
			.fn()
			.mockReturnValue(providedGetFieldSchema);

		getFieldSchema.mockReturnValue(fieldSchema);
		getFieldType.mockReturnValue({
			createGetFieldSchema,
			render,
		});

		const result = renderBySchema(
			formResult,
			getFieldSchema,
			getFieldType,
			getValues,
			name,
			payload,
			parents,
		);

		expect(result).toBe(renderResult);

		expect(render).toHaveBeenCalledWith(
			{
				fieldPath: expectedFieldPath,
				name,
				payload,
				parents: expectedParents,
				getFieldSchema: providedGetFieldSchema,
				getFieldType,
				fieldSchema,
			},
			formResult,
		);

		expect(getFieldType).toHaveBeenCalledTimes(1);
		expect(getFieldType).toHaveBeenCalledWith(fieldSchema);

		expect(createGetFieldSchema).toHaveBeenCalledTimes(1);
		expect(createGetFieldSchema).toHaveBeenCalledWith({
			fieldSchema,
			getFieldSchema,
			getFieldType,
			values,
			phase: "render",
			parents: expectedParents,
		});
	});
});
