import type { Locator, Page } from "@playwright/test";
import type { IFieldOptions } from "./types";

export function getListRoot(
	container: Page | Locator,
	{ exact, label, name }: IFieldOptions,
) {
	if (label) {
		const listLabel = container.getByText(label, {
			exact,
		});

		return listLabel.locator("..", {
			has: name
				? listLabel.page().locator("..").getByTestId(`@@list/${name}`)
				: undefined,
		});
	}

	return container.getByTestId(`@@list/${name}`);
}

export function getListBlock(
	container: Page | Locator,
	options: IFieldOptions,
	index: number,
) {
	const listRoot = getListRoot(container, options);

	return listRoot.locator(`> [role="list"] > div`).nth(index);
}

export function getListBlockTitle(listBlock: Locator) {
	return listBlock.locator("> .MuiCardHeader-root .MuiTypography-root");
}

export function getListAddButton(
	container: Page | Locator,
	options: IFieldOptions,
) {
	const listRoot = getListRoot(container, options);

	return listRoot.locator(`> [role="list"] + div`).getByTestId("@@list/add");
}

export async function addListBlock(
	container: Page | Locator,
	options: IFieldOptions,
) {
	const addButton = getListAddButton(container, options);

	await addButton.click();
}

export async function removeListBlock(
	container: Page | Locator,
	options: IFieldOptions,
	index: number,
) {
	const listBlock = getListBlock(container, options, index);

	const deleteIcon = listBlock.getByTestId("DeleteIcon");

	await deleteIcon.click();
}
