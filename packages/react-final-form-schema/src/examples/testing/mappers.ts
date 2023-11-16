export function getSelectText(element: HTMLElement): HTMLElement {
	const valueNode = element?.parentNode?.querySelector("[data-value]");

	return valueNode?.previousSibling as HTMLElement;
}
