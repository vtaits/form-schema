import type { TextFieldVariants } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
	BaseUIContext,
	type BaseUIContextValue,
} from "@vtaits/react-form-schema-base-ui";
import { type PropsWithChildren, type ReactElement, useMemo } from "react";
import { getContextValue } from "./contextValue";

type IMuiProviderProps = Readonly<
	PropsWithChildren<{
		size?: "small" | "medium";
		variant?: TextFieldVariants;
		ui?: Partial<BaseUIContextValue>;
	}>
>;

export function MuiProvider({
	children = undefined,
	size = "medium",
	variant = undefined,
	ui = undefined,
}: IMuiProviderProps): ReactElement {
	const contextValue = useMemo(() => {
		const baseUI = getContextValue(size, variant);

		return {
			...baseUI,
			...ui,
		};
	}, [size, variant, ui]);

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<BaseUIContext.Provider value={contextValue}>
				{children}
			</BaseUIContext.Provider>
		</LocalizationProvider>
	);
}
