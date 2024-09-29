import type { ReactNode } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { FieldSchemaWithRenderBase } from "../../core";

export type FormApi = UseFormReturn<FieldValues, any, FieldValues>;

export type BaseFieldSchema = FieldSchemaWithRenderBase & {
	hint?: ReactNode;
	autoFocus?: boolean;
	label?: ReactNode;
};
