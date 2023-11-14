import type { ParentType } from "@vtaits/form-schema";
import set from "lodash/set";

export function makeSetErrors<
	Values extends Record<string, any>,
	Errors extends Record<string, any>,
>(target: Errors) {
	return (
		fieldName: string,
		parents: readonly ParentType<Values>[] | undefined,
		error: unknown,
	) => {
		if (parents) {
			set(
				target,
				[
					...parents
						.filter((parent) => typeof parent.name !== "undefined")
						.map((parent) => parent.name as string),
					fieldName,
				],
				error,
			);
		} else {
			set(target, fieldName, error);
		}
	};
}
