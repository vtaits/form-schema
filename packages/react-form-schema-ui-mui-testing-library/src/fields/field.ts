import { within } from "@testing-library/dom";

export function queryFieldError(container: HTMLElement, name: string) {
	return within(container).queryByTestId(`@@error/${name}`);
}
