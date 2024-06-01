import type { HTMLProps, ReactNode } from "react";

export type ButtonRenderProps = Readonly<{
	children?: ReactNode;
	disabled?: boolean;
	onClick?: () => void;
}>;

export type ListItemWrapperRenderProps = Readonly<{
	children?: ReactNode;
	disabled?: boolean;
	handleRemove?: () => void;
	title?: ReactNode;
}>;

export type ListWrapperRenderProps = Readonly<{
	actions?: ReactNode;
	error?: ReactNode;
	hint?: ReactNode;
	items?: ReactNode;
	label?: ReactNode;
}>;

export type WrapperRenderProps = Readonly<{
	children?: ReactNode;
	error?: ReactNode;
	hint?: ReactNode;
	label?: ReactNode;
}>;

export type BaseFieldRenderProps = Readonly<{
	name: string;
	wrapper: WrapperRenderProps;
}>;

export type CheckboxRenderProps = Readonly<
	BaseFieldRenderProps & {
		checked: boolean;
		children?: ReactNode;
		onChange: (nextChecked: boolean) => void;
	}
>;

export type DatePickerRenderProps = Readonly<
	BaseFieldRenderProps & {
		displayDateFormat?: string;
		value: Date | null | undefined;
		onChange: (nextValue: Date | null | undefined) => void;
		inputProps: Partial<HTMLProps<HTMLInputElement>>;
	}
>;

export type FormRenderProps = Readonly<{
	actions?: ReactNode;
	error?: ReactNode;
	fields?: ReactNode;
	formProps?: HTMLProps<HTMLFormElement>;
	title?: ReactNode;
}>;

export type InputRenderProps = Readonly<
	BaseFieldRenderProps & {
		debounceTimeout?: number;
		inputProps: Partial<HTMLProps<HTMLInputElement>>;
	}
>;

export type MultiSelectRenderProps<OptionType> = Readonly<
	BaseFieldRenderProps & {
		options: readonly OptionType[];
		placeholder?: string;
		handleClear: () => void;
		value: readonly OptionType[];
		onChange: (nextValue: readonly OptionType[]) => void;
		getOptionLabel: (option: OptionType) => string;
		getOptionValue: (option: OptionType) => string;
	}
>;

export type SelectRenderProps<OptionType> = Readonly<
	BaseFieldRenderProps & {
		clearable?: boolean;
		options: readonly OptionType[];
		placeholder?: string;
		handleClear: () => void;
		value: OptionType | null | undefined;
		onChange: (nextValue: OptionType | null | undefined) => void;
		getOptionLabel: (option: OptionType) => string;
		getOptionValue: (option: OptionType) => string;
	}
>;

export type TextareaRenderProps = Readonly<
	BaseFieldRenderProps & {
		debounceTimeout?: number;
		textAreaProps: Partial<HTMLProps<HTMLTextAreaElement>>;
	}
>;

export type BaseUIContextValue = Readonly<{
	renderCheckbox: (renderProps: CheckboxRenderProps) => ReactNode;
	renderCheckboxGroup: <OptionType>(
		renderProps: MultiSelectRenderProps<OptionType>,
	) => ReactNode;
	renderDatePicker: (renderProps: DatePickerRenderProps) => ReactNode;
	renderDateTimePicker: (renderProps: DatePickerRenderProps) => ReactNode;
	renderForm: (renderProps: FormRenderProps) => ReactNode;
	renderRadioGroup: <OptionType>(
		renderProps: SelectRenderProps<OptionType>,
	) => ReactNode;
	renderInput: (renderProps: InputRenderProps) => ReactNode;
	renderListAddButton: (renderProps: ButtonRenderProps) => ReactNode;
	renderListItemWrapper: (renderProps: ListItemWrapperRenderProps) => ReactNode;
	renderListWrapper: (renderProps: ListWrapperRenderProps) => ReactNode;
	renderMultiSelect: <OptionType>(
		renderProps: MultiSelectRenderProps<OptionType>,
	) => ReactNode;
	renderSelect: <OptionType>(
		renderProps: SelectRenderProps<OptionType>,
	) => ReactNode;
	renderTextArea: (renderProps: TextareaRenderProps) => ReactNode;
	renderWrapper: (renderProps: WrapperRenderProps) => ReactNode;
}>;
