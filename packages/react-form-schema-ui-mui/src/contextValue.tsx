import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import TextField, {
	type TextFieldVariants,
	type TextFieldProps,
} from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import type {
	BaseUIContextValue,
	MultiSelectRenderProps,
} from "@vtaits/react-form-schema-base-ui";

export function getContextValue(
	muiSize: "small" | "medium",
	variant: TextFieldVariants | undefined,
): BaseUIContextValue {
	return {
		renderCheckbox: ({
			checked,
			disabled,
			autoFocus,
			name,
			onChange,
			children,
		}) => (
			<FormControlLabel
				control={
					<Checkbox
						autoFocus={autoFocus}
						checked={checked}
						disabled={disabled}
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
			disabled,
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

		renderDatePicker: ({
			autoFocus,
			disabled,
			displayDateFormat,
			onChange,
			value,
			wrapper: { label },
		}) => (
			<DatePicker
				autoFocus={autoFocus}
				disabled={disabled}
				format={displayDateFormat}
				label={label}
				value={value}
				onChange={onChange}
				slotProps={{ textField: { size: muiSize, variant } }}
			/>
		),

		renderDateTimePicker: ({
			disabled,
			displayDateFormat,
			autoFocus,
			onChange,
			value,
			wrapper: { label },
		}) => (
			<DateTimePicker
				autoFocus={autoFocus}
				disabled={disabled}
				format={displayDateFormat}
				label={label}
				value={value}
				onChange={onChange}
				slotProps={{ textField: { size: muiSize, variant } }}
			/>
		),

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
			disabled,
			inputProps: { color, ref, size, ...inputProps } = {},
			autoFocus,
			onChange,
			options,
			name,
			wrapper: { label },
		}) => {
			if (options && options.length > 0) {
				return (
					<Autocomplete
						autoFocus={autoFocus}
						disabled={disabled}
						freeSolo
						fullWidth
						options={options}
						size={muiSize}
						onSelect={onChange}
						renderInput={(params) => (
							<TextField
								name={name}
								{...inputProps}
								label={label}
								variant={variant}
								{...params}
								autoFocus={autoFocus}
								onChange={onChange}
							/>
						)}
					/>
				);
			}

			return (
				<TextField
					autoFocus={autoFocus}
					size={muiSize}
					fullWidth
					disabled={disabled}
					name={name}
					{...inputProps}
					onChange={onChange}
					label={label}
					variant={variant}
				/>
			);
		},

		renderListAddButton: ({ children, disabled, onClick }) => (
			<Button
				disabled={disabled}
				onClick={onClick}
				size={muiSize}
				startIcon={<AddIcon />}
				variant="text"
			>
				{children}
			</Button>
		),

		renderListItemWrapper: ({ children, disabled, handleRemove, title }) => (
			<Card>
				<CardHeader
					action={
						handleRemove && (
							<IconButton
								aria-label="Remove"
								disabled={disabled}
								color="primary"
								onClick={handleRemove}
							>
								<DeleteIcon />
							</IconButton>
						)
					}
					title={title}
				/>

				<CardContent>{children}</CardContent>
			</Card>
		),

		renderListWrapper: ({ actions, error, hint, items, label }) => (
			<div>
				{label && <FormLabel>{label}</FormLabel>}

				<Box
					role="list"
					sx={{
						display: "grid",
						gap: 2,
					}}
				>
					{items}
				</Box>

				{hint && (
					<p
						style={{
							color: "gray",
						}}
					>
						{hint}
					</p>
				)}

				{actions && <Box marginTop={2}>{actions}</Box>}

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
						disabled={disabled}
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
						variant={variant}
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
			disabled,
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
											disabled={disabled}
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
			disabled,
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
					disabled={disabled}
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
					variant={variant}
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

		renderTags: ({
			disabled,
			autoFocus,
			name,
			onChange,
			options,
			value,
			wrapper: { label },
		}) => (
			<Autocomplete
				autoFocus={autoFocus}
				disabled={disabled}
				multiple
				freeSolo
				fullWidth
				options={options || []}
				size={muiSize}
				value={value as string[]}
				onChange={(_, nextValue) => {
					onChange(nextValue);
				}}
				renderInput={(params) => (
					<TextField name={name} label={label} variant={variant} {...params} />
				)}
			/>
		),

		renderTextArea: ({
			disabled,
			autoFocus,
			name,
			textAreaProps: { color, ref, size, ...textAreaProps } = {},
			wrapper: { label },
		}) => (
			<TextField
				autoFocus={autoFocus}
				disabled={disabled}
				fullWidth
				multiline
				name={name}
				size={muiSize}
				variant={variant}
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
