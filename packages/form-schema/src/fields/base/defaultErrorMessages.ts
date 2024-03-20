import type { ErrorMessages } from "./types";

export const defaultErrorMessages: ErrorMessages = {
	required: "This field is required",
	minLength: (value) => `This field must contain at least ${value} elements`,
	minLengthStr: (value) => `This field must contain at least ${value} letters`,
	maxLength: (value) =>
		`This field must contain no more than ${value} elements`,
	maxLengthStr: (value) =>
		`This field must contain no more than ${value} letters`,
	regexp: (regexp) =>
		`The value should satisfy the regular expression ${regexp}`,
};
