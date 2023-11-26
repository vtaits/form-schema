import { useMemo } from "react";
import type { ReactElement } from "react";

import { type FieldComponentProps } from "../../core";
import { defaultRender } from "./defaultRender";
import type { SetSchema } from "./schema";

export function SetField<
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
	Payload,
>({
	fieldSchema,
}: FieldComponentProps<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors,
	Payload
>): ReactElement | null {
	const { schemas, render = defaultRender } =
		fieldSchema as unknown as SetSchema<FieldSchema>;

	const names = useMemo(() => Object.keys(schemas), [schemas]);

	return render(names) as ReactElement;
}
