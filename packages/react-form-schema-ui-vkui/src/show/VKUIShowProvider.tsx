import {
	BaseUIContext,
	type BaseUIContextValue,
} from "@vtaits/react-form-schema-base-ui";
import { type PropsWithChildren, type ReactElement, useMemo } from "react";
import type { IGetContextValusParams } from "../edit/contextValue";
import { getContextValue } from "./contextValue";

type IVKUIShowProviderProps = PropsWithChildren<
	IGetContextValusParams & {
		ui?: Partial<BaseUIContextValue>;
	}
>;

export function VKUIShowProvider({
	cardMode = undefined,
	children = undefined,
	ui = undefined,
}: IVKUIShowProviderProps): ReactElement {
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
