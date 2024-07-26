import { screen, waitFor } from "@testing-library/dom";

function getMenuByName(name: string) {
	return document.getElementById(`menu-${name}`);
}

export async function waitForOpenSelect(name: string) {
	const menuRes = await waitFor(() => {
		const menu = getMenuByName(name);

		if (!menu) {
			throw new Error(`select list "${name}" is not found`);
		}

		return menu;
	});

	return menuRes;
}

export async function waitForCloseSelect(name: string) {
	await waitFor(() => {
		if (getMenuByName(name)) {
			throw new Error("select list is still not closed");
		}
	});
}
