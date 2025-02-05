import type { ReactNode } from "react";

function renderArray(errors: readonly unknown[]): ReactNode {
	return errors.map((errorItem, index) => (
		// biome-ignore lint/suspicious/noArrayIndexKey: there is no id
		<div key={index}>{renderError(errorItem)}</div>
	));
}

export function renderError(error: unknown): ReactNode {
	if (!error) {
		return null;
	}

	if (typeof error === "string") {
		return error;
	}

	if (Array.isArray(error)) {
		return renderArray(error);
	}

	const message = (error as Record<string, unknown>).message;

	if (typeof message === "string") {
		return message;
	}

	if (Array.isArray(message)) {
		return renderArray(message);
	}

	return null;
}
