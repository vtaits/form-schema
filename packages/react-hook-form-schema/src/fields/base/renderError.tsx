import type { ReactNode } from "react";

export function renderError(error: unknown): ReactNode {
	if (!error) {
		return null;
	}

	if (typeof error === "string") {
		return error;
	}

	if (typeof (error as Record<string, unknown>).message === "string") {
		return (error as Record<string, string>).message;
	}

	return null;
}
