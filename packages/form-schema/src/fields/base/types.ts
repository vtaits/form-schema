export type ErrorMessages = {
	invalidNumber: string;
	required: string;
	minLength: (value: number) => string;
	minLengthStr: (value: number) => string;
	maxLength: (value: number) => string;
	maxLengthStr: (value: number) => string;
	regexp: (regexp: string) => string;
};

export type OnChange<FormApi, Value> = (
	form: FormApi,
	nextValue: Value,
	prevValue: Value,
) => void;

export type BaseFieldSchema<FormApi, Value> = {
	disabled?: boolean;
	required?: boolean;
	errorMessages?: Partial<ErrorMessages>;
	onChange?: OnChange<FormApi, Value>;
};
