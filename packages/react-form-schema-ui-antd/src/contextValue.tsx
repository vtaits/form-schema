import type {
	BaseUIContextValue,
	MultiSelectRenderProps,
} from "@vtaits/react-form-schema-base-ui";
import { Checkbox, Col, Input, Radio, Row, Select } from "antd";

const wrapperStyle = {
	marginBottom: "24px",
};

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
			<div className="ant-form-item" style={wrapperStyle}>
				<Row className="ant-form-item-row">
					<Col xs={8} className="ant-form-item-label">
						{label && <label>{label}</label>}
					</Col>

					<Col xs={16} className="ant-form-item-control">
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
					</Col>
				</Row>
			</div>
		);
	},
};
