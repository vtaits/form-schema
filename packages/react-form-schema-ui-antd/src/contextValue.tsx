import type {
	BaseUIContextValue,
	MultiSelectRenderProps,
} from "@vtaits/react-form-schema-base-ui";
import {
	Alert,
	Checkbox,
	DatePicker,
	Input,
	Radio,
	Select,
	Typography,
} from "antd";
import dayjs from "dayjs";
import { FieldRow } from "./FieldRow";

export const contextValue: BaseUIContextValue = {
	renderCheckbox: ({ checked, name, onChange, children }) => (
		<Checkbox
			name={name}
			checked={checked}
			onChange={(event) => {
				onChange(event.target.checked);
			}}
		>
			{children}
		</Checkbox>
	),

	renderCheckboxGroup: ({
		name,
		value,
		onChange,
		options,
		getOptionLabel,
		getOptionValue,
	}) => {
		const selectedValuesSet = new Set(
			value.map((option) => getOptionValue(option)),
		);

		return (
			<div>
				{options.map((option) => {
					const optionValue = getOptionValue(option);
					const checked = selectedValuesSet.has(optionValue);

					return (
						<div key={optionValue}>
							<Checkbox
								name={name}
								checked={checked}
								onChange={() => {
									if (checked) {
										onChange(
											value.filter(
												(valueItem) =>
													getOptionValue(valueItem) !== optionValue,
											),
										);
									} else {
										onChange([...value, option]);
									}
								}}
							>
								{getOptionLabel(option)}
							</Checkbox>
						</div>
					);
				})}
			</div>
		);
	},

	renderDatePicker: ({ displayDateFormat, onChange, value }) => (
		<DatePicker
			format={displayDateFormat}
			value={value ? dayjs(value) : undefined}
			onChange={(dayjs) => {
				if (!dayjs) {
					onChange(null);
					return;
				}

				onChange(dayjs.toDate());
			}}
		/>
	),

	renderDateTimePicker: ({ displayDateFormat, onChange, value }) => (
		<DatePicker
			format={displayDateFormat}
			value={value ? dayjs(value) : undefined}
			onChange={(dayjs) => {
				if (!dayjs) {
					onChange(null);
					return;
				}

				onChange(dayjs.toDate());
			}}
			showTime
		/>
	),

	renderForm: ({ actions, error, fields, formProps, title }) => (
		<form className="ant-form ant-form-horizontal" {...formProps}>
			{title && (
				<Typography.Title
					level={3}
					style={{
						marginBottom: "30px",
					}}
				>
					{title}
				</Typography.Title>
			)}

			{fields}

			{error && (
				<div
					style={{
						marginTop: "20px",
						marginBottom: "20px",
					}}
				>
					<Alert message={error} type="error" />
				</div>
			)}

			<FieldRow>{actions}</FieldRow>
		</form>
	),

	renderInput: ({ inputProps: { ref, size, ...inputProps } = {}, name }) => (
		<Input name={name} {...inputProps} />
	),

	renderListAddButton: ({ children, onClick, disabled }) => (
		<button type="button" onClick={onClick}>
			{children}
		</button>
	),

	renderListItemWrapper: ({ children, disabled, handleRemove, title }) => (
		<fieldset>
			{title && <legend>{title}</legend>}

			{children}

			{handleRemove && (
				<button disabled={disabled} type="button" onClick={handleRemove}>
					Remove
				</button>
			)}
		</fieldset>
	),

	renderListWrapper: ({ actions, error, hint, items, label }) => (
		<div>
			{label && <label>{label}</label>}

			<div role="list">{items}</div>

			{hint && (
				<p
					style={{
						color: "gray",
					}}
				>
					{hint}
				</p>
			)}

			{actions && <div>{actions}</div>}

			<p
				style={{
					color: "gray",
				}}
			>
				{error}
			</p>
		</div>
	),

	renderMultiSelect: <OptionType,>({
		options,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}: MultiSelectRenderProps<OptionType>) => (
		<Select
			mode="multiple"
			onChange={(nextSelectValue) => {
				const nextValue: OptionType[] = [];

				for (const optionValue of nextSelectValue) {
					const selectedOption = options.find(
						(option) => getOptionValue(option) === optionValue,
					);

					if (selectedOption) {
						nextValue.push(selectedOption);
					}
				}

				onChange(nextValue);
			}}
			value={value ? value.map(getOptionValue) : []}
			options={options.map((option) => ({
				label: getOptionLabel(option),
				value: getOptionValue(option),
			}))}
			style={{
				width: "100%",
			}}
		/>
	),

	renderRadioGroup: ({
		name,
		value,
		onChange,
		options,
		getOptionLabel,
		getOptionValue,
	}) => {
		const selectedValue = value ? getOptionValue(value) : null;

		return (
			<div>
				{options.map((option) => {
					const optionValue = getOptionValue(option);

					return (
						<div key={optionValue}>
							<Radio
								name={name}
								checked={optionValue === selectedValue}
								onChange={() => {
									onChange(option);
								}}
							>
								{getOptionLabel(option)}
							</Radio>
						</div>
					);
				})}
			</div>
		);
	},

	renderSelect: ({
		clearable,
		options,
		placeholder,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}) => (
		<Select
			allowClear={clearable}
			onChange={(nextValue) => {
				const selectedOption = options.find(
					(option) => getOptionValue(option) === nextValue,
				);

				onChange(selectedOption);
			}}
			placeholder={placeholder}
			value={value ? getOptionValue(value) : ""}
			options={options.map((option) => ({
				label: getOptionLabel(option),
				value: getOptionValue(option),
			}))}
			style={{
				width: "100%",
			}}
		/>
	),

	renderTextArea: ({
		textAreaProps: { ref, size, onResize, ...textAreaProps } = {},
		name,
	}) => <Input.TextArea name={name} {...textAreaProps} />,

	renderWrapper: ({ children, error, hint, label }) => {
		return (
			<FieldRow label={label && <label>{label}</label>}>
				{children}

				{hint && (
					<p
						style={{
							color: "gray",
						}}
					>
						{hint}
					</p>
				)}

				{error && (
					<p
						style={{
							color: "red",
						}}
					>
						{error}
					</p>
				)}
			</FieldRow>
		);
	},
};
