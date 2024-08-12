import type { ReactElement } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { expect, test } from "vitest";
import type { RenderParams } from "../../core";
import { DynamicField } from "./DynamicField";
import { dynamic } from "./dynamic";

test("provide correct component", () => {
	const renderParams = {
		RENDER_PARAMS: true,
	} as unknown as RenderParams<any>;
	const formResult = {
		FORM_RESULT: true,
	} as unknown as UseFormReturn<FieldValues, any, FieldValues>;

	const renderResult = dynamic.render(renderParams, formResult) as ReactElement;
	expect(renderResult.type).toBe(DynamicField);
	expect(renderResult.props).toEqual({
		renderParams,
		formResult,
	});
});
