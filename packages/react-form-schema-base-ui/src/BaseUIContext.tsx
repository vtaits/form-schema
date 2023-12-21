import { createContext } from "react";
import type { BaseUIContextValue, MultiSelectRenderProps } from "./types";

export const BaseUIContext = createContext<BaseUIContextValue>({
	renderCheckbox: ({ checked, name, onChange, children }) => (
		<label>
			<input
				name={name}
				type="checkbox"
				checked={checked}
				onChange={(event) => {
					onChange(event.target.checked);
				}}
			/>

			{children}
		</label>
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
						<label key={optionValue}>
							<input
								name={name}
								type="checkbox"
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
							/>

							{getOptionLabel(option)}
						</label>
					);
				})}
			</div>
		);
	},

	renderForm: ({ actions, error, fields, formProps, title }) => (
		<form {...formProps}>
			{title && <h1>{title}</h1>}

			{fields}

			{error && (
				<p
					style={{
						color: "red",
						fontSize: "1.5em",
					}}
				>
					{error}
				</p>
			)}

			<div>{actions}</div>
		</form>
	),

	renderInput: ({ inputProps, name }) => <input name={name} {...inputProps} />,

	renderMultiSelect: <OptionType,>({
		name,
		options,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}: MultiSelectRenderProps<OptionType>) => {
		const selectedValuesSet = new Set(
			value.map((option) => getOptionValue(option)),
		);

		return (
			<select
				multiple
				name={name}
				onChange={(event) => {
					const nextValue: OptionType[] = [];

					for (const option of Array.from(event.target.options)) {
						if (option.selected) {
							const optionValue = option.value;
							const selectedOption = options.find(
								(option) => getOptionValue(option) === optionValue,
							);

							if (selectedOption) {
								nextValue.push(selectedOption);
							}
						}
					}

					onChange(nextValue);
				}}
			>
				{options.map((option) => {
					const optionValue = getOptionValue(option);

					return (
						<option
							selected={selectedValuesSet.has(optionValue)}
							key={optionValue}
							value={optionValue}
						>
							{getOptionLabel(option)}
						</option>
					);
				})}
			</select>
		);
	},

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
						<label key={optionValue}>
							<input
								name={name}
								type="radio"
								checked={optionValue === selectedValue}
								onChange={() => {
									onChange(option);
								}}
							/>

							{getOptionLabel(option)}
						</label>
					);
				})}
			</div>
		);
	},

	renderSelect: ({
		clearable,
		name,
		options,
		placeholder,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}) => (
		<select
			name={name}
			onChange={(event) => {
				const nextValue = event.target.value;

				const selectedOption = options.find(
					(option) => getOptionValue(option) === nextValue,
				);

				onChange(selectedOption);
			}}
			value={value ? getOptionValue(value) : ""}
		>
			{clearable && <option value="">{placeholder}</option>}

			{options.map((option) => {
				const optionValue = getOptionValue(option);

				return (
					<option key={optionValue} value={optionValue}>
						{getOptionLabel(option)}
					</option>
				);
			})}
		</select>
	),

	renderTextArea: ({ textAreaProps, name }) => (
		<textarea name={name} {...textAreaProps} />
	),

	renderWrapper: ({ children, error, hint, label }) => (
		<div>
			{label && <label>{label}</label>}

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

			<p
				style={{
					color: "gray",
				}}
			>
				{error}
			</p>
		</div>
	),
});
