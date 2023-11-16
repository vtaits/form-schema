import { act, fireEvent } from "@testing-library/react";

export async function changeInput(element: HTMLElement, value: string) {
	act(() => {
		fireEvent.change(element, {
			target: {
				value,
			},
			currentTarget: {
				value,
			},
		});
	});
}

export async function clearSelect(element: HTMLElement) {
	const selectClearButton = element.querySelector(
		'[class*="indicatorContainer"]:first-child',
	) as HTMLElement;

	act(() => {
		fireEvent.mouseDown(selectClearButton);
	});
}
