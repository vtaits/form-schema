import { parse } from "date-fns/parse";
import { parseISO } from "date-fns/parseISO";
import {
	DATE_FORMAT_DATE,
	DATE_FORMAT_ISO,
	DATE_FORMAT_TS,
	DATE_FORMAT_UNIX,
} from "./constants";

export function parseValue(rawValue: unknown, dateFormat: string) {
	if (!rawValue) {
		return null;
	}

	if (rawValue instanceof Date) {
		return rawValue;
	}

	if (dateFormat === DATE_FORMAT_DATE) {
		return null;
	}

	if (typeof rawValue === "number") {
		switch (dateFormat) {
			case DATE_FORMAT_TS:
				return new Date(rawValue);

			case DATE_FORMAT_UNIX:
				return new Date(rawValue * 1000);

			default:
				return null;
		}
	}

	if (typeof rawValue === "string") {
		switch (dateFormat) {
			case DATE_FORMAT_ISO:
				return parseISO(rawValue);

			default:
				return parse(rawValue, dateFormat, new Date());
		}
	}

	return null;
}
