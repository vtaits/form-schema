import { expect, test } from "vitest";
import * as formSchamaLib from "./index";
import { defaultParser, parse } from "./parse";
import { defaultSerializer, serialize } from "./serialize";
import { serializeSingle } from "./serializeSingle";
import { defaultFieldErrorsSetter, setFieldErrors } from "./setFieldErrors";
import { validateBeforeSubmit } from "./validateBeforeSubmit";

test("should export needed modules", () => {
	expect(formSchamaLib.serialize).toBe(serialize);
	expect(formSchamaLib.serialize).toBeTruthy();

	expect(formSchamaLib.defaultSerializer).toBe(defaultSerializer);
	expect(formSchamaLib.defaultSerializer).toBeTruthy();

	expect(formSchamaLib.serializeSingle).toBe(serializeSingle);
	expect(formSchamaLib.serializeSingle).toBeTruthy();

	expect(formSchamaLib.parse).toBe(parse);
	expect(formSchamaLib.parse).toBeTruthy();

	expect(formSchamaLib.defaultParser).toBe(defaultParser);
	expect(formSchamaLib.defaultParser).toBeTruthy();

	expect(formSchamaLib.validateBeforeSubmit).toBe(validateBeforeSubmit);
	expect(formSchamaLib.validateBeforeSubmit).toBeTruthy();

	expect(formSchamaLib.setFieldErrors).toBe(setFieldErrors);
	expect(formSchamaLib.setFieldErrors).toBeTruthy();

	expect(formSchamaLib.defaultFieldErrorsSetter).toBe(defaultFieldErrorsSetter);
	expect(formSchamaLib.defaultFieldErrorsSetter).toBeTruthy();
});
