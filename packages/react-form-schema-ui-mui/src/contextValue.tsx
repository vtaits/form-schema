import { InputLabel } from "@mui/material";
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

export function getContextValue(
	muiSize: "small" | "medium",
): BaseUIContextValue {
	return {
		renderCheckbox: ({ checked, name, onChange, children }) => (
			<FormControlLabel
				control={
					<Checkbox
						checked={checked}
						size={muiSize}
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
			wrapper: { label },
		}) => {
			const selectedValuesSet = new Set(
				value.map((option) => getOptionValue(option)),
			);

			return (
				<FormControl>
					{label && <FormLabel>{label}</FormLabel>}

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
												size={muiSize}
											/>
										}
										label={getOptionLabel(option)}
									/>
								</div>
							);
						})}
					</div>
				</FormControl>
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
				size={muiSize}
				fullWidth
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
			wrapper: { label },
		}: MultiSelectRenderProps<OptionType>) => {
			const selectedValuesArr = value.map(getOptionValue);
			const selectedValuesSet = new Set(selectedValuesArr);

			return (
				<FormControl fullWidth>
					{label && (
						<InputLabel
							id={`${name}/label`}
							size={muiSize === "small" ? "small" : undefined}
						>
							{label}
						</InputLabel>
					)}
					<Select
						labelId={`${name}/label`}
						label={label}
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
						size={muiSize}
						value={selectedValuesArr}
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
				</FormControl>
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
											size={muiSize}
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
			wrapper: { label },
		}) => (
			<FormControl fullWidth>
				{label && (
					<InputLabel
						size={muiSize === "small" ? "small" : undefined}
						id={`${name}/label`}
					>
						{label}
					</InputLabel>
				)}
				<Select
					labelId={`${name}/label`}
					label={label}
					name={name}
					onChange={(event) => {
						const nextValue = event.target.value;

						const selectedOption = options.find(
							(option) => getOptionValue(option) === nextValue,
						);

						onChange(selectedOption);
					}}
					size={muiSize}
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
			</FormControl>
		),

		renderTextArea: ({
			name,
			textAreaProps: { color, ref, size, ...textAreaProps } = {},
			wrapper: { label },
		}) => (
			<TextField
				fullWidth
				multiline
				name={name}
				size={muiSize}
				{...(textAreaProps as Omit<TextFieldProps, "variant">)}
				label={label}
			/>
		),

		renderWrapper: ({ children, error, hint, label }) => {
			return (
				<Box marginBottom={2}>
					{children}

					{hint && <FormHelperText>{hint}</FormHelperText>}

					{error && <FormHelperText error>{error}</FormHelperText>}
				</Box>
			);
		},
	};
}
