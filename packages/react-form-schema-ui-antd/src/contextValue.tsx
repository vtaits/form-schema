import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type {
	BaseUIContextValue,
	MultiSelectRenderProps,
} from "@vtaits/react-form-schema-base-ui";
import {
	Alert,
	AutoComplete,
	Button,
	Card,
	Checkbox,
	DatePicker,
	Flex,
	Input,
	Radio,
	Select,
	Typography,
} from "antd";
import dayjs from "dayjs";
import { FieldRow } from "./FieldRow";

export const contextValue: BaseUIContextValue = {
	renderCheckbox: ({ checked, disabled, name, onChange, children }) => (
		<Checkbox
			checked={checked}
			disabled={disabled}
			name={name}
			onChange={(event) => {
				onChange(event.target.checked);
			}}
		>
			{children}
		</Checkbox>
	),

	renderCheckboxGroup: ({
		disabled,
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
								checked={checked}
								disabled={disabled}
								name={name}
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

	renderDatePicker: ({ disabled, displayDateFormat, onChange, value }) => (
		<DatePicker
			disabled={disabled}
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

	renderDateTimePicker: ({ disabled, displayDateFormat, onChange, value }) => (
		<DatePicker
			disabled={disabled}
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

	renderInput: ({
		disabled,
		options,
		inputProps: { ref, size, onSelect: _onSelect, ...inputProps } = {},
		onChange,
		name,
	}) => {
		if (options && options.length > 0) {
			const searchValue = String(inputProps.value || "").toLowerCase();

			return (
				<AutoComplete
					options={options
						.filter((option) => option.toLowerCase().includes(searchValue))
						.map((option) => ({
							value: option,
						}))}
					disabled={disabled}
					name={name}
					{...inputProps}
					onChange={onChange}
					style={{ width: "100%" }}
				/>
			);
		}

		return (
			<Input
				disabled={disabled}
				name={name}
				{...inputProps}
				onChange={onChange}
			/>
		);
	},

	renderListAddButton: ({ children, onClick, disabled }) => (
		<Button
			disabled={disabled}
			icon={<PlusOutlined />}
			onClick={onClick}
			type="link"
		>
			{children}
		</Button>
	),

	renderListItemWrapper: ({ children, disabled, handleRemove, title }) => (
		<Card
			title={title}
			extra={
				handleRemove && (
					<Button
						disabled={disabled}
						icon={<DeleteOutlined />}
						onClick={handleRemove}
						shape="circle"
						type="link"
					/>
				)
			}
		>
			{children}
		</Card>
	),

	renderListWrapper: ({ actions, error, hint, items, label }) => {
		return (
			<FieldRow label={label && <label>{label}</label>}>
				<Flex gap="middle" vertical role="list">
					{items}
				</Flex>

				<Flex
					gap="small"
					style={{
						marginTop: 16,
					}}
				>
					{actions}
				</Flex>

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

	renderMultiSelect: <OptionType,>({
		disabled,
		options,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}: MultiSelectRenderProps<OptionType>) => (
		<Select
			disabled={disabled}
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
		disabled,
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
								checked={optionValue === selectedValue}
								disabled={disabled}
								name={name}
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
		disabled,
		options,
		placeholder,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}) => (
		<Select
			allowClear={clearable}
			disabled={disabled}
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

	renderTags: ({ disabled, name, options, onChange, value }) => (
		<Select
			disabled={disabled}
			mode="tags"
			onChange={onChange}
			options={
				options
					? options.map((option) => ({
							value: option,
							label: option,
						}))
					: []
			}
			style={{ width: "100%" }}
		/>
	),

	renderTextArea: ({
		disabled,
		textAreaProps: { ref, size, onResize, ...textAreaProps } = {},
		name,
	}) => <Input.TextArea disabled={disabled} name={name} {...textAreaProps} />,

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
