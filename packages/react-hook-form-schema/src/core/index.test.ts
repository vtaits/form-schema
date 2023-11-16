import { expect, test } from "vitest";

import { CLIENT_ERROR, SERVER_ERROR } from "./constants";
import * as lib from "./index";
import { renderBySchema } from "./renderBySchema";
import { useFormSchema } from "./useFormSchema";

test("export necessary modules", () => {
	expect(lib.renderBySchema).toBe(renderBySchema);
	expect(lib.renderBySchema).toBeTruthy();

	expect(lib.useFormSchema).toBe(useFormSchema);
	expect(lib.useFormSchema).toBeTruthy();

	expect(lib.CLIENT_ERROR).toBe(CLIENT_ERROR);
	expect(lib.CLIENT_ERROR).toBeTruthy();

	expect(lib.SERVER_ERROR).toBe(SERVER_ERROR);
	expect(lib.SERVER_ERROR).toBeTruthy();
});
