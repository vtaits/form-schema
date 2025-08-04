import { BaseUIContext } from "@vtaits/react-form-schema-base-ui";
import type { PropsWithChildren, ReactElement } from "react";
import { contextValue } from "./contextValue";

export function VKUIShowProvider({
	children = undefined,
}: PropsWithChildren): ReactElement {
	return (
		<BaseUIContext.Provider value={contextValue}>
			{children}
		</BaseUIContext.Provider>
	);
}
