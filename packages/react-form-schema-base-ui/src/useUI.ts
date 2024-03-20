import { useContext } from "react";
import { BaseUIContext } from "./BaseUIContext";
import type { BaseUIContextValue } from "./types";

export function useUI(): BaseUIContextValue {
	return useContext(BaseUIContext);
}
