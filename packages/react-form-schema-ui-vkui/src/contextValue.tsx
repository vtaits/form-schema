import {
	Checkbox,
	ChipsSelect,
	FormItem,
	FormStatus,
	Input,
	Radio,
	Select,
	Textarea,
	Title,
} from "@vkontakte/vkui";
import type {
	BaseUIContextValue,
	MultiSelectRenderProps,
} from "@vtaits/react-form-schema-base-ui";

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

	renderForm: ({ actions, error, fields, formProps, title }) => (
		<form className="ant-form ant-form-horizontal" {...formProps}>
			{title && (
				<Title
					level="3"
					style={{
						marginBottom: "30px",
					}}
				>
					{title}
				</Title>
			)}

			{fields}

			{error && (
				<div
					style={{
						marginTop: "20px",
						marginBottom: "20px",
					}}
				>
					<FormStatus mode="error">{error}</FormStatus>
				</div>
			)}

			<FormItem>{actions}</FormItem>
		</form>
	),

	renderInput: ({ inputProps: { ref, size, ...inputProps } = {}, name }) => (
		<Input name={name} {...inputProps} />
	),

	renderMultiSelect: <OptionType,>({
		options,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}: MultiSelectRenderProps<OptionType>) => (
		<ChipsSelect
			onChange={(nextSelectValue) => {
				const nextValue: OptionType[] = [];

				for (const selectedChip of nextSelectValue) {
					const selectedOption = options.find(
						(option) => getOptionValue(option) === selectedChip.value,
					);

					if (selectedOption) {
						nextValue.push(selectedOption);
					}
				}

				onChange(nextValue);
			}}
			value={
				value
					? value.map((option) => ({
							label: getOptionLabel(option),
							value: getOptionValue(option),
					  }))
					: []
			}
			options={options.map((option) => ({
				label: getOptionLabel(option),
				value: getOptionValue(option),
			}))}
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
			allowClearButton={clearable}
			onChange={(event) => {
				const nextValue = event.target.value;

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
		/>
	),

	renderTextArea: ({
		textAreaProps: { ref, size, onResize, defaultValue, ...textAreaProps } = {},
		name,
	}) => (
		<Textarea
			name={name}
			{...textAreaProps}
			defaultValue={defaultValue as string}
		/>
	),

	renderWrapper: ({ children, error, hint, label }) => {
		return (
			<FormItem
				top={label}
				bottom={
					<>
						{hint && (
							<div
								style={{
									color: "gray",
								}}
							>
								{hint}
							</div>
						)}

						{error && (
							<div
								style={{
									color: "red",
								}}
							>
								{error}
							</div>
						)}
					</>
				}
			>
				{children}
			</FormItem>
		);
	},
};
