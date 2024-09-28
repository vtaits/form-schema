import type { ErrorMessages } from "./types";

export const defaultErrorMessages: ErrorMessages = {
	invalidNumber: "The value should be a valid number",
	required: "This field is required",
	minLength: (value) => `This field must contain at least ${value} elements`,
	minLengthStr: (value) => `This field must contain at least ${value} letters`,
	minLengthFile: (value) =>
		`The size of this file must not be less than ${value} bytes`,
	maxLength: (value) =>
		`This field must contain no more than ${value} elements`,
	maxLengthStr: (value) =>
		`This field must contain no more than ${value} letters`,
	maxLengthFile: (value) =>
		`The size of this file must no exceed ${value} bytes`,
	regexp: (regexp) =>
		`The value should satisfy the regular expression ${regexp}`,
};
