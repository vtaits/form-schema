import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type {
	BaseUIContextValue,
	MultiSelectRenderProps,
} from "@vtaits/react-form-schema-base-ui";
import type { ChangeEventHandler } from "react";

export const contextValue: BaseUIContextValue = {
	renderCheckbox: ({ checked, name, onChange, children }) => (
		<FormControlLabel
			control={
				<Checkbox
					checked={checked}
					name={name}
					onChange={(event) => {
						onChange(event.target.checked);
					}}
				/>
			}
			label={children}
		/>
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
							<FormControlLabel
								control={
									<Checkbox
										checked={checked}
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
									/>
								}
								label={getOptionLabel(option)}
							/>
						</div>
					);
				})}
			</div>
		);
	},

	renderForm: ({ actions, error, fields, formProps, title }) => (
		<form {...formProps}>
			{title && (
				<Typography variant="h3" gutterBottom>
					{title}
				</Typography>
			)}

			{fields}

			{error && (
				<Box marginTop={2} marginBottom={2}>
					<Alert severity="error">{error}</Alert>
				</Box>
			)}

			<Box marginTop={2}>{actions}</Box>
		</form>
	),

	renderInput: ({
		inputProps: { color, ref, size, onChange, ...inputProps } = {},
		name,
		wrapper: { label },
	}) => (
		<TextField
			name={name}
			{...inputProps}
			onChange={
				onChange as ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
			}
			label={label}
		/>
	),

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
			<Select
				multiple
				name={name}
				onChange={(event) => {
					const eventValue = event.target.value;

					const selectedValues =
						typeof eventValue === "string"
							? eventValue.split(",")
							: (eventValue as string[]);

					const nextValue: OptionType[] = [];

					for (const optionValue of selectedValues) {
						const selectedOption = options.find(
							(option) => getOptionValue(option) === optionValue,
						);

						if (selectedOption) {
							nextValue.push(selectedOption);
						}
					}

					onChange(nextValue);
				}}
			>
				{options.map((option) => {
					const optionValue = getOptionValue(option);

					return (
						<MenuItem
							selected={selectedValuesSet.has(optionValue)}
							key={optionValue}
							value={optionValue}
						>
							{getOptionLabel(option)}
						</MenuItem>
					);
				})}
			</Select>
		);
	},

	renderRadioGroup: ({
		name,
		value,
		onChange,
		options,
		getOptionLabel,
		getOptionValue,
		wrapper: { label },
	}) => {
		const selectedValue = value ? getOptionValue(value) : null;

		return (
			<FormControl>
				{label && <FormLabel>{label}</FormLabel>}

				<RadioGroup value={selectedValue}>
					{options.map((option) => {
						const optionValue = getOptionValue(option);

						return (
							<FormControlLabel
								control={
									<Radio
										name={name}
										onChange={() => {
											onChange(option);
										}}
									/>
								}
								key={optionValue}
								label={getOptionLabel(option)}
								value={optionValue}
							/>
						);
					})}
				</RadioGroup>
			</FormControl>
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
		<Select
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
			{clearable && (
				<MenuItem value="">
					<i>{placeholder}</i>
				</MenuItem>
			)}

			{options.map((option) => {
				const optionValue = getOptionValue(option);

				return (
					<MenuItem key={optionValue} value={optionValue}>
						{getOptionLabel(option)}
					</MenuItem>
				);
			})}
		</Select>
	),

	renderTextArea: ({
		name,
		textAreaProps: { color, ref, size, ...textAreaProps } = {},
		wrapper: { label },
	}) => (
		<TextField
			multiline
			name={name}
			{...(textAreaProps as Omit<TextFieldProps, "variant">)}
			label={label}
		/>
	),

	renderWrapper: ({ children, error, hint, label }) => {
		return (
			<div>
				{children}

				{hint && <FormHelperText>{hint}</FormHelperText>}

				{error && <FormHelperText error>{error}</FormHelperText>}
			</div>
		);
	},
};
