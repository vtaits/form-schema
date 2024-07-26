import { fireEvent, within } from "@testing-library/dom";
import { act } from "@testing-library/react";

export function queryListRoot(container: HTMLElement, listId: string) {
	return within(container).queryByTestId(`@@list/${listId}`);
}

export function getListBlock(
	container: HTMLElement,
	listId: string,
	index: number,
) {
	const listRoot = queryListRoot(container, listId);

	if (!listRoot) {
		throw new Error(`List root "${listId}" is not found`);
	}

	return within(listRoot).getByTestId(`@@list-item/${listId}[${index}]`);
}

export function getListAddButton(container: HTMLElement, listId: string) {
	const listRoot = queryListRoot(container, listId);

	if (!listRoot) {
		throw new Error(`List root "${listId}" is not found`);
	}

	return within(listRoot).getByTestId("@@list/add");
}

export function addListBlock(container: HTMLElement, listId: string) {
	const addButton = getListAddButton(container, listId);

	act(() => {
		fireEvent.click(addButton);
	});
}

export function removeListBlock(
	container: HTMLElement,
	listId: string,
	index: number,
) {
	const listBlock = getListBlock(container, listId, index);

	const deleteIcon = within(listBlock).getByTestId("DeleteIcon");

	act(() => {
		fireEvent.click(deleteIcon);
	});
}
