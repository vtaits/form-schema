import type { ReactElement } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { expect, test } from "vitest";

import type { RenderParams } from "../../core";
import { SetField } from "./SetField";
import { set } from "./set";

test("provide correct component", () => {
	const renderParams = {
		RENDER_PARAMS: true,
	} as unknown as RenderParams<any>;
	const formResult = {
		FORM_RESULT: true,
	} as unknown as UseFormReturn<FieldValues, any, FieldValues>;

	const renderResult = set.render(renderParams, formResult) as ReactElement;
	expect(renderResult.type).toBe(SetField);
	expect(renderResult.props).toEqual({
		renderParams,
		formResult,
	});
});
