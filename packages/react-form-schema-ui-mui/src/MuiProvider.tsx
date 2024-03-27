import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { BaseUIContext } from "@vtaits/react-form-schema-base-ui";
import { type PropsWithChildren, type ReactElement, useMemo } from "react";
import { getContextValue } from "./contextValue";

type MuiProviderProps = Readonly<
	PropsWithChildren<{
		size?: "small" | "medium";
	}>
>;

export function MuiProvider({
	children = undefined,
	size = "medium",
}: MuiProviderProps): ReactElement {
	const contextValue = useMemo(() => getContextValue(size), [size]);
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<BaseUIContext.Provider value={contextValue}>
				{children}
			</BaseUIContext.Provider>
		</LocalizationProvider>
	);
}
