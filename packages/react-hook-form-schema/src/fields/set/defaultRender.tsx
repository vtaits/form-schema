import type { ReactElement } from "react";
import { Fragment } from "react";
import type { RenderField } from "../../core";

export function defaultRender(
	renderField: RenderField<any, any>,
	names: readonly string[],
	excludePaths: readonly string[][] | undefined,
): ReactElement {
	const excludePathGroups = excludePaths
		? Object.groupBy(excludePaths, (path) => path[0])
		: undefined;

	const namesForRender = excludePathGroups
		? names.filter((name) => {
				const excludePathsForField = excludePathGroups[name];

				if (!excludePathsForField) {
					return true;
				}

				return excludePathsForField.every((path) => path.length > 1);
			})
		: names;

	return (
		<>
			{namesForRender.map((name) => {
				const excludePathsForField = excludePathGroups
					? excludePathGroups[name]
					: undefined;

				const content = excludePathsForField
					? renderField(name, {
							excludePaths: excludePathsForField.map(([_, ...rest]) => rest),
						})
					: renderField(name);

				return <Fragment key={name}>{content}</Fragment>;
			})}
		</>
	);
}
