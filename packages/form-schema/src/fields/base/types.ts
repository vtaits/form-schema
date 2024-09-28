import type { FieldSchemaBase } from "../../core";

export type ErrorMessages = {
	invalidNumber: string;
	required: string;
	minLength: (value: number) => string;
	minLengthStr: (value: number) => string;
	minLengthFile: (value: number) => string;
	maxLength: (value: number) => string;
	maxLengthStr: (value: number) => string;
	maxLengthFile: (value: number) => string;
	regexp: (regexp: string) => string;
};

export type OnChange<FormApi, Value> = (
	form: FormApi,
	nextValue: Value,
	prevValue: Value,
) => void;

export type BaseFieldSchema<FormApi, Value> = FieldSchemaBase & {
	disabled?: boolean;
	required?: boolean;
	errorMessages?: Partial<ErrorMessages>;
	onChange?: OnChange<FormApi, Value>;
};
