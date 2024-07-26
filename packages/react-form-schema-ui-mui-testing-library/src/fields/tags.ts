import { act, fireEvent, within } from "@testing-library/react";
import { queryInput, setInputValue } from "./input";

export {
	queryInput as queryTags,
	getInputSuggestions as getTagsSuggestions,
	selectInputSuggestion as selectTagsSuggestion,
} from "./input";

export function addTagsValue(
	container: HTMLElement,
	name: string,
	label: string | null,
	value: string,
) {
	const input = queryInput(container, name, label);

	if (!input) {
		throw new Error(`Input with name "${name}" not found`);
	}

	act(() => {
		fireEvent.change(input, {
			target: {
				value,
			},
		});
	});

	act(() => {
		fireEvent.keyDown(input, {
			key: "Enter",
			code: 13,
			charCode: 13,
		});
	});
}

export function getTagsChips(
	container: HTMLElement,
	name: string,
	label: string | null,
) {
	const input = queryInput(container, name, label);

	if (!input?.parentNode) {
		throw new Error(`Input with name "${name}" not found`);
	}

	return [...input.parentNode.querySelectorAll(".MuiChip-root")];
}

export function removeTagsChip(
	container: HTMLElement,
	name: string,
	label: string | null,
	chip: string,
) {
	const input = queryInput(container, name, label);

	if (!input?.parentNode) {
		throw new Error(`Input with name "${name}" not found`);
	}

	const chipLabel = within(input.parentNode as HTMLElement).getByText(chip);
	const chipWrapper = chipLabel.closest(".MuiChip-root");

	if (!chipWrapper) {
		throw new Error("Chip wrapper is not found");
	}

	const removeButton = within(chipWrapper as HTMLElement).getByTestId(
		"CancelIcon",
	);

	act(() => {
		fireEvent.click(removeButton);
	});
}
