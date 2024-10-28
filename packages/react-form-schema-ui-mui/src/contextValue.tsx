import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { Stack } from "@mui/material";
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
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import type {
	BaseUIContextValue,
	MultiSelectRenderProps,
} from "@vtaits/react-form-schema-base-ui";

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

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
			wrapper: { required },
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
						required={required}
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
			wrapper: { label, required },
		}) => {
			const selectedValuesSet = new Set(
				value.map((option) => getOptionValue(option)),
			);

			return (
				<FormControl>
					{label && <FormLabel required={required}>{label}</FormLabel>}

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
												value={optionValue}
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
			name,
			onChange,
			value,
			wrapper: { label, required },
		}) => (
			<DatePicker
				autoFocus={autoFocus}
				disabled={disabled}
				format={displayDateFormat}
				label={label}
				name={name}
				value={value}
				onChange={onChange}
				slotProps={{ textField: { size: muiSize, variant, required } }}
			/>
		),

		renderDateTimePicker: ({
			disabled,
			displayDateFormat,
			autoFocus,
			name,
			onChange,
			value,
			wrapper: { label, required },
		}) => (
			<DateTimePicker
				autoFocus={autoFocus}
				disabled={disabled}
				format={displayDateFormat}
				label={label}
				name={name}
				value={value}
				onChange={onChange}
				slotProps={{ textField: { size: muiSize, variant, required } }}
			/>
		),

		renderFileInput: ({
			accept,
			children,
			disabled,
			name,
			onSelectFile,
			wrapper: { label },
			selectedFile,
		}) => (
			<>
				<Button
					component="label"
					variant="outlined"
					size={muiSize}
					tabIndex={-1}
					startIcon={<CloudUploadIcon />}
				>
					{label || children}
					<VisuallyHiddenInput
						accept={accept}
						disabled={disabled}
						name={name}
						type="file"
						onChange={(event) => {
							onSelectFile(event.target.files?.[0] || null);
							event.target.value = "";
						}}
					/>
				</Button>

				{selectedFile && (
					<Stack
						direction="row"
						spacing={1}
						alignItems="center"
						data-testid="file"
					>
						<AttachFileIcon />

						<span data-testid="filename">{selectedFile}</span>

						<IconButton
							aria-label="Remove"
							disabled={disabled}
							color="primary"
							onClick={() => {
								onSelectFile(null);
							}}
						>
							<DeleteIcon />
						</IconButton>
					</Stack>
				)}
			</>
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
						<Alert severity="error" data-testid="@@form/error">
							{error}
						</Alert>
					</Box>
				)}

				<Box marginTop={2}>{actions}</Box>
			</form>
		),

		renderInput: ({
			disabled,
			inputProps: {
				color,
				ref,
				size,
				value,
				onChange: _onChange,
				...inputProps
			} = {},
			autoFocus,
			onChange,
			options,
			name,
			wrapper: { label, required },
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
				return (
					<Autocomplete
						autoFocus={autoFocus}
						disabled={disabled}
						freeSolo
						fullWidth
						options={options}
						size={muiSize}
						value={String(value || "")}
						onInputChange={(_event, inputValue) => {
							onChange(inputValue);
						}}
						renderInput={(params) => (
							<TextField
								name={name}
								{...inputProps}
								label={label}
								variant={variant}
								{...params}
								autoFocus={autoFocus}
								required={required}
								// onChange={wrappedOnChange}
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
					value={String(value || "")}
					onChange={wrappedOnChange}
					label={label}
					required={required}
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
				data-testid="@@list/add"
			>
				{children}
			</Button>
		),

		renderListItemWrapper: ({
			children,
			disabled,
			handleRemove,
			title,
			name,
		}) => (
			<Card data-testid={`@@list-item/${name}`}>
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

		renderListWrapper: ({
			actions,
			error,
			hint,
			items,
			label,
			name,
			required,
		}) => (
			<Box marginBottom={2} data-testid={`@@list/${name}`}>
				{label && <FormLabel required={required}>{label}</FormLabel>}

				<Box
					// biome-ignore lint/a11y/useSemanticElements: avoid excess styles
					role="list"
					sx={{
						display: "grid",
						gap: 2,
					}}
				>
					{items}
				</Box>

				{hint && (
					<FormHelperText data-testid={`@@hint/${name}`}>{hint}</FormHelperText>
				)}

				{actions && <Box marginTop={2}>{actions}</Box>}

				{error && (
					<FormHelperText data-testid={`@@error/${name}`} error>
						{error}
					</FormHelperText>
				)}
			</Box>
		),

		renderMultiSelect: <OptionType,>({
			disabled,
			name,
			options,
			value,
			onChange,
			getOptionLabel,
			getOptionValue,
			wrapper: { label, required },
		}: MultiSelectRenderProps<OptionType>) => {
			const selectedValuesArr = value.map(getOptionValue);
			const selectedValuesSet = new Set(selectedValuesArr);

			return (
				<FormControl fullWidth>
					{label && (
						<InputLabel
							id={`${name}/label`}
							size={muiSize === "small" ? "small" : undefined}
							required={required}
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
			wrapper: { label, required },
		}) => {
			const selectedValue = value ? getOptionValue(value) : null;

			return (
				<FormControl>
					{label && <FormLabel required={required}>{label}</FormLabel>}

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
			disabled,
			name,
			options,
			placeholder = "",
			value,
			onChange,
			getOptionLabel,
			getOptionValue,
			wrapper: { label, required },
		}) => (
			<FormControl fullWidth>
				{label && (
					<InputLabel
						size={muiSize === "small" ? "small" : undefined}
						id={`${name}/label`}
						shrink={Boolean(value || value === 0 || placeholder)}
						required={required}
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
					displayEmpty
				>
					{placeholder ? (
						<MenuItem value="">
							<i>{placeholder}</i>
						</MenuItem>
					) : null}

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
			wrapper: { label, required },
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
					<TextField
						name={name}
						label={label}
						variant={variant}
						{...params}
						required={required}
					/>
				)}
			/>
		),

		renderTextArea: ({
			disabled,
			autoFocus,
			name,
			textAreaProps: { color, ref, size, ...textAreaProps } = {},
			wrapper: { label, required },
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
				required={required}
			/>
		),

		renderWrapper: ({ children, error, hint, name }) => {
			return (
				<Box marginBottom={2}>
					{children}

					{hint && (
						<FormHelperText data-testid={`@@hint/${name}`}>
							{hint}
						</FormHelperText>
					)}

					{error && (
						<FormHelperText data-testid={`@@error/${name}`} error>
							{error}
						</FormHelperText>
					)}
				</Box>
			);
		},
	};
}
