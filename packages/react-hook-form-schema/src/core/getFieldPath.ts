import type { ParentType } from "@vtaits/form-schema";

export function getFieldPath(
	fieldName: string,
	parents: readonly ParentType[],
) {
	if (!parents || parents.length === 0) {
		return fieldName;
	}

	return [
		...parents
			.map(({ name }) => name)
			.filter((name) => ["string", "number"].includes(typeof name)),
		fieldName,
	].join(".");
}
