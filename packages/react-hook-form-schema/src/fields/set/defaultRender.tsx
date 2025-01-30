import { Fragment } from "react";
import type { ReactElement } from "react";
import type { RenderField } from "../../core";

export function defaultRender(
	renderField: RenderField<any, any>,
	names: readonly string[],
): ReactElement {
	return (
		<>
			{names.map((name) => (
				<Fragment key={name}>{renderField(name)}</Fragment>
			))}
		</>
	);
}
