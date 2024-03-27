import { isValid } from "date-fns/isValid";
import { parseValue } from "./parseValue";

export function parseValueAndValidate(rawValue: unknown, dateFormat: string) {
	const parsed = parseValue(rawValue, dateFormat);

	if (!parsed) {
		return null;
	}

	if (isValid(parsed)) {
		return parsed;
	}

	return null;
}
