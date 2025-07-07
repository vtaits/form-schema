import { cleanup, render as testingRender } from "@testing-library/react";
import type { UseFormReturn } from "react-hook-form";
import { afterEach, describe, expect, test, vi } from "vitest";
import { renderBySchema } from "./renderBySchema";

const values = {
	foo: "bar",
};

const getValues = () => values;

const fieldSchema = "FIELD_SCHEMA";

const getFieldSchema = vi.fn();

const name = "NAME";
const payload = "PAYLOAD";
const renderResult = <div>RENDER_RESULT</div>;

const formResult = {
	FORM_RESULT: true,
} as unknown as UseFormReturn<any, any, any>;

afterEach(() => {
	vi.resetAllMocks();
	cleanup();
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
	test("render with own `getFieldSchema`", async () => {
		const render = vi.fn().mockReturnValue(renderResult);
		const getFieldType = vi.fn().mockReturnValue({
			render,
		});

		getFieldSchema.mockReturnValue(fieldSchema);

		const result = testingRender(
			renderBySchema(
				formResult,
				getFieldSchema,
				getFieldType,
				getValues,
				name,
				payload,
				parents,
			),
		);

		await result.findByText("RENDER_RESULT");

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

		expect(getFieldType).toHaveBeenCalledWith(fieldSchema);
	});

	test("render with computed `getFieldSchema`", async () => {
		const render = vi.fn().mockReturnValue(renderResult);

		const providedGetFieldSchema = vi.fn();
		const createGetFieldSchema = vi
			.fn()
			.mockReturnValue(providedGetFieldSchema);

		getFieldSchema.mockReturnValue(fieldSchema);
		const getFieldType = vi.fn().mockReturnValue({
			createGetFieldSchema,
			render,
		});

		const result = testingRender(
			renderBySchema(
				formResult,
				getFieldSchema,
				getFieldType,
				getValues,
				name,
				payload,
				parents,
			),
		);

		await result.findByText("RENDER_RESULT");

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

	test("render with async computed `getFieldSchema`", async () => {
		const render = vi.fn().mockReturnValue(renderResult);

		const providedGetFieldSchema = vi.fn();
		const createGetFieldSchema = vi
			.fn()
			.mockResolvedValue(providedGetFieldSchema);

		getFieldSchema.mockReturnValue(fieldSchema);
		const getFieldType = vi.fn().mockReturnValue({
			createGetFieldSchema,
			render,
		});

		const result = testingRender(
			renderBySchema(
				formResult,
				getFieldSchema,
				getFieldType,
				getValues,
				name,
				payload,
				parents,
			),
		);

		await result.findByText("RENDER_RESULT");

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
