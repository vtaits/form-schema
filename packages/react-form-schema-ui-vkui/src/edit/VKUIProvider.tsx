import { BaseUIContext } from "@vtaits/react-form-schema-base-ui";
import { type PropsWithChildren, type ReactElement, useMemo } from "react";
import { getContextValue, type IGetContextValusParams } from "./contextValue";

export function VKUIProvider({
	cardMode = undefined,
	children = undefined,
}: PropsWithChildren<IGetContextValusParams>): ReactElement {
	const contextValue = useMemo(
		() =>
			getContextValue({
				cardMode,
			}),
		[cardMode],
	);

	return (
		<BaseUIContext.Provider value={contextValue}>
			{children}
		</BaseUIContext.Provider>
	);
}
