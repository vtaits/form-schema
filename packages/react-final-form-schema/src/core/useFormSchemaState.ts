import { useValuesReady } from "./useValuesReady";

import type { FormSchemaStateContextType } from "./types";

export const useFormSchemaState = (): FormSchemaStateContextType => {
	const isValuesReady = useValuesReady();

	return {
		isValuesReady,
	};
};
