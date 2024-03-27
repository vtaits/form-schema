import { format } from "date-fns/format";
import { formatISO } from "date-fns/formatISO";
import {
	DATE_FORMAT_DATE,
	DATE_FORMAT_ISO,
	DATE_FORMAT_TS,
	DATE_FORMAT_UNIX,
} from "./constants";

export function serializeDate(date: Date, dateFormat: string) {
	switch (dateFormat) {
		case DATE_FORMAT_DATE:
			return date;

		case DATE_FORMAT_TS:
			return date.getTime();

		case DATE_FORMAT_UNIX:
			return Math.round(date.getTime() / 1000);

		case DATE_FORMAT_ISO:
			return formatISO(date);

		default:
			return format(date, dateFormat);
	}
}
