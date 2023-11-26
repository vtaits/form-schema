import type { ReactElement } from "react";

import { FormField } from "../../core";

export function defaultRender(names: readonly string[]): ReactElement {
	return (
		<>
			{names.map((name) => (
				<FormField name={name} key={name} />
			))}
		</>
	);
}
