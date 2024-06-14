import type { TextFieldVariants } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { BaseUIContext } from "@vtaits/react-form-schema-base-ui";
import { type PropsWithChildren, type ReactElement, useMemo } from "react";
import { getContextValue } from "./contextValue";

type MuiProviderProps = Readonly<
	PropsWithChildren<{
		size?: "small" | "medium";
		variant?: TextFieldVariants;
	}>
>;

export function MuiProvider({
	children = undefined,
	size = "medium",
	variant = undefined,
}: MuiProviderProps): ReactElement {
	const contextValue = useMemo(
		() => getContextValue(size, variant),
		[size, variant],
	);
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<BaseUIContext.Provider value={contextValue}>
				{children}
			</BaseUIContext.Provider>
		</LocalizationProvider>
	);
}
