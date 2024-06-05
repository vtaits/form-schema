export type ErrorMessages = {
	required: string;
	minLength: (value: number) => string;
	minLengthStr: (value: number) => string;
	maxLength: (value: number) => string;
	maxLengthStr: (value: number) => string;
	regexp: (regexp: string) => string;
};

export type BaseFieldSchema = {
	disabled?: boolean;
	required?: boolean;
	errorMessages?: Partial<ErrorMessages>;
};
