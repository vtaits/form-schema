import type { NameType, ParentType } from "@vtaits/form-schema";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function makeSetError<Values extends FieldValues>(
	setError: UseFormSetError<Values>,
	errorType: string,
	onError: () => void,
) {
	return (
		fieldName: NameType,
		parents: readonly ParentType[] | undefined,
		error: unknown,
	) => {
		onError();

		if (parents) {
			setError(
				`${[
					...parents
						.filter((parent) => typeof parent.name !== "undefined")
						.map((parent) => parent.name as string),
					fieldName,
				].join(".")}` as Path<Values>,
				{
					type: errorType,
					message: error as string,
				},
			);
		} else {
			setError(fieldName as Path<Values>, {
				type: errorType,
				message: error as string,
			});
		}
	};
}
