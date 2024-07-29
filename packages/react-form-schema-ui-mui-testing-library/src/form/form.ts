import { within } from "@testing-library/dom";

export function queryFormError(container: HTMLElement) {
	const errorWrapper = within(container).queryByTestId("@@form/error");

	if (!errorWrapper) {
		return null;
	}

	return errorWrapper.querySelector(".MuiAlert-message") as HTMLElement | null;
}
