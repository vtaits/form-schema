import { useMemo, useRef } from "react";

export function useOptionsCache<OptionType>(
	options: readonly OptionType[],
	getOptionValue: (option: OptionType) => string | number,
) {
	const optionsCache = useMemo(() => {
		const res: Record<string, OptionType> = {};

		for (const option of options) {
			res[getOptionValue(option)] = option;
		}

		return res;
	}, [getOptionValue, options]);

	const optionsCacheRef = useRef<Record<string, OptionType>>(optionsCache);

	optionsCacheRef.current = optionsCache;

	return optionsCacheRef;
}
