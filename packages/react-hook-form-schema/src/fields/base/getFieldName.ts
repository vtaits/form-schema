import type { ParentType } from "@vtaits/form-schema";

export function getFieldName(name: string, parents: readonly ParentType[]) {
	if (!parents || parents.length === 0) {
		return name;
	}

	return [...parents.map(({ name }) => name).filter(Boolean), name].join(".");
}
