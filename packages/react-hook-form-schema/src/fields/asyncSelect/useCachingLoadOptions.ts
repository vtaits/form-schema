import { useCallback, useRef } from "react";
import type { LoadOptions } from "select-async-paginate-model";

export function useCachingLoadOptions<OptionType, Additional>(
	loadOptions: LoadOptions<OptionType, Additional>,
	getOptionValue: (option: OptionType) => string,
) {
	const optionsCacheRef = useRef<Record<string, OptionType>>({});

	const loadOptionsProxy = useCallback<LoadOptions<OptionType, Additional>>(
		async (...args) => {
			const result = await loadOptions(...args);

			const { options } = result;

			for (const option of options) {
				optionsCacheRef.current[getOptionValue(option)] = option;
			}

			return result;
		},
		[loadOptions, getOptionValue],
	);

	return [optionsCacheRef, loadOptionsProxy] as const;
}
