import { format } from "date-fns/format";
import { isValid } from "date-fns/isValid";
import { parse } from "date-fns/parse";
import { createContext } from "react";
import type { BaseUIContextValue, MultiSelectRenderProps } from "./types";

const DATE_FORMAT = "yyyy-MM-dd";
const DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm";

export const BaseUIContext = createContext<BaseUIContextValue>({
	renderCheckbox: ({ checked, disabled, name, onChange, children }) => (
		<label>
			<input
				disabled={disabled}
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
						<label key={optionValue}>
							<input
								disabled={disabled}
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

	renderDatePicker: ({ disabled, inputProps, onChange, value }) => (
		<input
			disabled={disabled}
			{...inputProps}
			type="date"
			value={value ? format(value, DATE_FORMAT) : ""}
			onChange={(event) => {
				const dateRaw = event.target.value;

				if (!dateRaw) {
					onChange(null);
					return;
				}

				const date = parse(dateRaw, DATE_FORMAT, new Date());

				if (!isValid(date)) {
					onChange(null);
					return;
				}

				onChange(date);
			}}
		/>
	),

	renderDateTimePicker: ({ disabled, inputProps, onChange, value }) => (
		<input
			disabled={disabled}
			{...inputProps}
			type="datetime-local"
			value={value ? format(value, DATETIME_FORMAT) : ""}
			onChange={(event) => {
				const dateRaw = event.target.value;

				if (!dateRaw) {
					onChange(null);
					return;
				}

				const date = parse(dateRaw, DATETIME_FORMAT, new Date());

				if (!isValid(date)) {
					onChange(null);
					return;
				}

				onChange(date);
			}}
		/>
	),

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

	renderInput: ({ disabled, inputProps, name }) => (
		<input name={name} disabled={disabled} {...inputProps} />
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
		disabled,
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
				disabled={disabled}
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
						<label key={optionValue}>
							<input
								disabled={disabled}
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
		disabled,
		name,
		options,
		placeholder,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}) => (
		<select
			disabled={disabled}
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

	renderTextArea: ({ disabled, name, textAreaProps }) => (
		<textarea disabled={disabled} name={name} {...textAreaProps} />
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
