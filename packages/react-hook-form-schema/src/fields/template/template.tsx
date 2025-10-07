import type { FieldType } from "../../core";
import type { TemplateSchema } from "./schema";

export const template: FieldType<TemplateSchema> = {
	render: ({ fieldSchema: { renderTemplate } }, formResult) => {
		return renderTemplate({
			formResult,
		});
	},

	errorsSetter: () => {},

	parser: () => ({}),

	serializer: () => ({}),

	validatorBeforeSubmit: () => {},

	valueSetter: () => {},
};
