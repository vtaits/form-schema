import type { ReactNode } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { BaseFieldSchema } from "../base";

export type TemplateSchema = BaseFieldSchema & {
	renderTemplate: (renderProps: {
		formResult: UseFormReturn<FieldValues, any, FieldValues>;
	}) => ReactNode;
};
