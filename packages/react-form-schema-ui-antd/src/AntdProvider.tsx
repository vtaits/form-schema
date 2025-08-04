import {
	BaseUIContext,
	type BaseUIContextValue,
} from "@vtaits/react-form-schema-base-ui";
import { type PropsWithChildren, type ReactElement, useMemo } from "react";
import { contextValue as baseUI } from "./contextValue";

type IAntdProviderProps = PropsWithChildren<{
	ui?: Partial<BaseUIContextValue>;
}>;

export function AntdProvider({
	children = undefined,
	ui = undefined,
}: IAntdProviderProps): ReactElement {
	const contextValue = useMemo(() => {
		return {
			...baseUI,
			...ui,
		};
	}, [ui]);

	return (
		<BaseUIContext.Provider value={contextValue}>
			{children}
		</BaseUIContext.Provider>
	);
}
