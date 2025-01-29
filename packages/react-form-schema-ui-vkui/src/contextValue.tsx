import {
	Icon12Add,
	Icon16Attach,
	Icon16Delete,
	Icon16DocumentOutline,
} from "@vkontakte/icons";
import {
	Button,
	CardGrid,
	Checkbox,
	ChipsSelect,
	ContentCard,
	DateInput,
	File,
	Footnote,
	FormItem,
	FormStatus,
	IconButton,
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
	renderAsyncSelect: () => (
		<FormStatus mode="default">
			Async select is currently not supported for VKUI
		</FormStatus>
	),

	renderAsyncMultiSelect: () => (
		<FormStatus mode="default">
			Async multi select is currently not supported for VKUI
		</FormStatus>
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
			disabled={disabled}
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

	renderDatePicker: ({ disabled, autoFocus, name, onChange, value }) => (
		<div style={{ display: "flex" }}>
			<DateInput
				autoFocus={autoFocus}
				disabled={disabled}
				name={name}
				value={value || undefined}
				onChange={onChange}
			/>
		</div>
	),

	renderDateTimePicker: ({ disabled, autoFocus, name, onChange, value }) => (
		<div style={{ display: "flex" }}>
			<DateInput
				autoFocus={autoFocus}
				disabled={disabled}
				name={name}
				enableTime
				value={value || undefined}
				onChange={onChange}
			/>
		</div>
	),

	renderFileInput: ({
		accept,
		children,
		disabled,
		name,
		onSelectFile,
		selectedFile,
	}) => (
		<>
			<File
				accept={accept}
				before={<Icon16DocumentOutline role="presentation" />}
				disabled={disabled}
				name={name}
				mode="secondary"
				onChange={(event) => {
					onSelectFile(event.target.files?.[0] || null);
					event.target.value = "";
				}}
			>
				{children}
			</File>

			{selectedFile && (
				<p
					style={{
						display: "flex",
						alignItems: "center",
						gap: "10px",
					}}
				>
					<Icon16Attach />
					{selectedFile}
					<IconButton
						disabled={disabled}
						label="Удалить"
						onClick={() => {
							onSelectFile(null);
						}}
					>
						<Icon16Delete />
					</IconButton>
				</p>
			)}
		</>
	),

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
					<FormStatus mode="error" data-testid="@@form/error">
						{error}
					</FormStatus>
				</div>
			)}

			<FormItem>{actions}</FormItem>
		</form>
	),

	renderInput: ({
		disabled,
		inputProps: { ref, size, ...inputProps } = {},
		autoFocus,
		onChange,
		options,
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
			const listId = `${name}-datalist`;

			return (
				<>
					<Input
						autoFocus={autoFocus}
						disabled={disabled}
						list={`${name}-datalist`}
						name={name}
						{...inputProps}
						onChange={wrappedOnChange}
					/>

					<datalist id={listId}>
						{options.map((option) => (
							<option key={option} value={option} />
						))}
					</datalist>
				</>
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

	renderListAddButton: ({ children, disabled, onClick }) => (
		<Button
			before={<Icon12Add />}
			disabled={disabled}
			mode="link"
			onClick={onClick}
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
		<CardGrid size="l" data-testid={`@@list-item/${name}`}>
			<ContentCard
				header={
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<div>{title}</div>

						{handleRemove && (
							<IconButton
								disabled={disabled}
								label="Удалить"
								onClick={handleRemove}
							>
								<Icon16Delete />
							</IconButton>
						)}
					</div>
				}
				text={children}
			/>
		</CardGrid>
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
			<FormItem
				top={label}
				bottom={
					<>
						{hint && (
							<p
								style={{
									color: "gray",
								}}
							>
								{hint}
							</p>
						)}

						{actions && (
							<div
								style={{
									marginTop: "8px",
								}}
							>
								{actions}
							</div>
						)}

						{error && (
							<p
								style={{
									color: "red",
								}}
								role="alert"
							>
								{error}
							</p>
						)}
					</>
				}
				data-testid={`@@list/${name}`}
				required={required}
			>
				<div role="list">{items}</div>
			</FormItem>
		);
	},

	renderMultiSelect: <OptionType,>({
		disabled,
		autoFocus,
		options,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}: MultiSelectRenderProps<OptionType>) => (
		<ChipsSelect
			autoFocus={autoFocus}
			disabled={disabled}
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
		placeholder,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}) => (
		<Select
			allowClearButton={clearable}
			autoFocus={autoFocus}
			disabled={disabled}
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
			searchable
		/>
	),

	renderTags: ({
		createLabel,
		disabled,
		autoFocus,
		name,
		onChange,
		options,
		value,
	}) => (
		<ChipsSelect
			autoFocus={autoFocus}
			creatable={
				(typeof createLabel === "string" && createLabel) || "Create new"
			}
			disabled={disabled}
			name={name}
			onChange={(nextOptions) => {
				onChange(nextOptions.map(({ value: option }) => option));
			}}
			options={
				options
					? options.map((option) => ({
							value: option,
							label: option,
						}))
					: []
			}
			value={value.map((option) => ({
				value: option,
				label: option,
			}))}
		/>
	),

	renderTextArea: ({
		disabled,
		autoFocus,
		textAreaProps: { ref, size, onResize, defaultValue, ...textAreaProps } = {},
		name,
	}) => (
		<Textarea
			autoFocus={autoFocus}
			disabled={disabled}
			name={name}
			{...textAreaProps}
			defaultValue={defaultValue as string}
		/>
	),

	renderWrapper: ({ children, error, hint, label, required }) => {
		return (
			<FormItem
				top={label}
				bottom={error}
				status={error ? "error" : undefined}
				required={required}
			>
				{children}

				{hint && (
					<Footnote
						style={{
							color: "gray",
							paddingTop: 6,
						}}
					>
						{hint}
					</Footnote>
				)}
			</FormItem>
		);
	},
};
