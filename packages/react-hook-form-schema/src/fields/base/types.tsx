import type { ReactNode } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export type FormApi = UseFormReturn<FieldValues, any, FieldValues>;

export type BaseFieldSchema = {
	hint?: ReactNode;
	autoFocus?: boolean;
	label?: ReactNode;
};
