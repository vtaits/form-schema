import {
	DeleteOutlined,
	PlusOutlined,
	UploadOutlined,
} from "@ant-design/icons";
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
	Upload,
} from "antd";
import dayjs from "dayjs";
import { FieldRow } from "./FieldRow";

export const contextValue: BaseUIContextValue = {
	renderAsyncSelect: () => (
		<Alert
			type="warning"
			message="Async select is currently not supported for Antd"
		/>
	),

	renderAsyncMultiSelect: () => (
		<Alert
			type="warning"
			message="Async multi select is currently not supported for Antd"
		/>
	),

	renderCheckbox: ({
		checked,
		disabled,
		autoFocus,
		name,
		onChange,
		children,
	}) => (
		<Checkbox
			autoFocus={autoFocus}
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

	renderDatePicker: ({
		disabled,
		displayDateFormat,
		autoFocus,
		onChange,
		value,
	}) => (
		<DatePicker
			autoFocus={autoFocus}
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

	renderDateTimePicker: ({
		disabled,
		displayDateFormat,
		autoFocus,
		onChange,
		value,
	}) => (
		<DatePicker
			autoFocus={autoFocus}
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

	renderFileInput: ({
		accept,
		children,
		disabled,
		name,
		onSelectFile,
		selectedFile,
	}) => (
		<Upload
			accept={accept}
			disabled={disabled}
			name={name}
			onChange={(e) => {
				onSelectFile(e.file.originFileObj || null);
			}}
			fileList={
				selectedFile
					? [
							{
								name: selectedFile,
								uid: selectedFile,
							},
						]
					: []
			}
		>
			<Button icon={<UploadOutlined />}>{children}</Button>
		</Upload>
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
					<Alert message={error} type="error" data-testid="@@form/error" />
				</div>
			)}

			<FieldRow>{actions}</FieldRow>
		</form>
	),

	renderInput: ({
		disabled,
		options,
		inputProps: {
			ref,
			size,
			defaultValue: _defaultValue,
			onSelect: _onSelect,
			...inputProps
		} = {},
		autoFocus,
		onChange,
		name,
	}) => {
		const wrappedOnChange = <
			Target extends {
				value: string;
			},
			E extends {
				target: Target;
			},
		>(
			event: E,
		) => {
			onChange(event.target.value);
		};

		if (options && options.length > 0) {
			const value = String(inputProps.value || "");
			const searchValue = value.toLowerCase();

			return (
				<AutoComplete
					autoFocus={autoFocus}
					options={options
						.filter((option) => option.toLowerCase().includes(searchValue))
						.map((option) => ({
							value: option,
						}))}
					disabled={disabled}
					name={name}
					{...inputProps}
					value={value}
					onChange={onChange}
					style={{ width: "100%" }}
				/>
			);
		}

		return (
			<Input
				autoFocus={autoFocus}
				disabled={disabled}
				name={name}
				{...inputProps}
				onChange={wrappedOnChange}
			/>
		);
	},

	renderListAddButton: ({ children, onClick, disabled }) => (
		<Button
			disabled={disabled}
			icon={<PlusOutlined />}
			onClick={onClick}
			type="link"
			data-testid="@@list/add"
		>
			{children}
		</Button>
	),

	renderListItemWrapper: ({
		children,
		disabled,
		handleRemove,
		name,
		title,
	}) => (
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
			data-testid={`@@list-item/${name}`}
		>
			{children}
		</Card>
	),

	renderListWrapper: ({
		actions,
		error,
		hint,
		items,
		label,
		name,
		required,
	}) => {
		return (
			<FieldRow
				// biome-ignore lint/a11y/noLabelWithoutControl: list has no associated input
				label={label && <label>{label}</label>}
				data-testid={`@@list/${name}`}
				required={required}
			>
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
		autoFocus,
		options,
		optionsCacheRef,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}: MultiSelectRenderProps<OptionType>) => (
		<Select
			autoFocus={autoFocus}
			disabled={disabled}
			mode="multiple"
			onChange={(nextSelectValue) => {
				const nextValue: OptionType[] = [];

				for (const optionValue of nextSelectValue) {
					const selectedOption = optionsCacheRef.current[optionValue];

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
		autoFocus,
		options,
		optionsCacheRef,
		placeholder,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}) => (
		<Select
			allowClear={clearable}
			autoFocus={autoFocus}
			disabled={disabled}
			onChange={(nextValue) => {
				const selectedOption = optionsCacheRef.current[nextValue];

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

	renderTags: ({ disabled, autoFocus, options, onChange, value }) => (
		<Select
			autoFocus={autoFocus}
			value={value}
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
		autoFocus,
		textAreaProps: { ref, size, ...textAreaProps } = {},
		name,
	}) => (
		<Input.TextArea
			autoFocus={autoFocus}
			disabled={disabled}
			name={name}
			{...textAreaProps}
		/>
	),

	renderWrapper: ({ children, error, hint, label, required }) => {
		return (
			// biome-ignore lint/a11y/noLabelWithoutControl: TO DO
			<FieldRow label={label && <label>{label}</label>} required={required}>
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
