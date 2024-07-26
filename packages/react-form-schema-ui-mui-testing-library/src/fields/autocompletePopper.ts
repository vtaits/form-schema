import { waitFor } from "@testing-library/dom";

function getPopper() {
	return document.querySelector(".MuiAutocomplete-popper");
}

export async function waitForOpenPopper() {
	const popperRes = await waitFor(() => {
		const popper = getPopper();

		if (!popper) {
			throw new Error("popper is not found");
		}

		return popper;
	});

	return popperRes;
}

export async function waitForClosePopper() {
	await waitFor(() => {
		if (getPopper()) {
			throw new Error("popper is still not closed");
		}
	});
}
