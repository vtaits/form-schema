import {
	BaseUIContext,
	type BaseUIContextValue,
} from "@vtaits/react-form-schema-base-ui";
import { type PropsWithChildren, type ReactElement, useMemo } from "react";
import { getContextValue, type IGetContextValusParams } from "./contextValue";

type IVKUIProviderProps = PropsWithChildren<
	IGetContextValusParams & {
		ui?: Partial<BaseUIContextValue>;
	}
>;

export function VKUIProvider({
	cardMode = undefined,
	children = undefined,
	ui = undefined,
}: IVKUIProviderProps): ReactElement {
	const contextValue = useMemo(() => {
		const baseUI = getContextValue({
			cardMode,
		});

		return {
			...baseUI,
			...ui,
		};
	}, [cardMode, ui]);

	return (
		<BaseUIContext.Provider value={contextValue}>
			{children}
		</BaseUIContext.Provider>
	);
}
