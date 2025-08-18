import {
	Icon12Add,
	Icon16Attach,
	Icon16Delete,
	Icon16DocumentOutline,
} from "@vkontakte/icons";
import {
	Button,
	CardGrid,
	type CardProps,
	Checkbox,
	type ChipOption,
	ChipsSelect,
	ContentCard,
	type CustomSelectOptionInterface,
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
import type { LoadOptions } from "select-async-paginate-model";
import {
	ChipsAsyncPaginate,
	CustomAsyncPaginate,
} from "select-async-paginate-vkui";

export type IGetContextValusParams = {
	cardMode?: CardProps["mode"];
};

export function getContextValue({
	cardMode,
}: IGetContextValusParams): BaseUIContextValue {
	return {
		renderAsyncSelect: ({
			clearable,
			disabled,
			autoFocus,
			additional,
			initialAdditional,
			optionsCacheRef,
			loadOptions,
			placeholder,
			value,
			onChange,
			getOptionValue,
			getOptionLabel,
			renderOption,
		}) => (
			<CustomAsyncPaginate
				allowClearButton={clearable}
				autoFocus={autoFocus}
				disabled={disabled}
				onChange={(_event, nextValue) => {
					const selectedOption =
						typeof nextValue === "string" || typeof nextValue === "number"
							? optionsCacheRef.current[nextValue]
							: null;
					onChange(selectedOption);
				}}
				placeholder={placeholder}
				valueWithLabel={
					value
						? {
								value: getOptionValue(value),
								label: getOptionLabel(value),
							}
						: null
				}
				additional={additional}
				initialAdditional={initialAdditional}
				loadOptions={
					loadOptions as unknown as LoadOptions<
						CustomSelectOptionInterface,
						unknown
					>
				}
				searchable
				renderOption={
					renderOption
						? (renderProps) =>
								renderOption(
									renderProps.option as Parameters<typeof renderOption>[0],
									renderProps,
								)
						: undefined
				}
			/>
		),

		renderAsyncMultiSelect: ({
			disabled,
			autoFocus,
			additional,
			initialAdditional,
			loadOptions,
			value,
			onChange,
			getOptionLabel,
			getOptionValue,
			renderOption,
		}) => (
			<ChipsAsyncPaginate
				autoFocus={autoFocus}
				disabled={disabled}
				onChange={onChange as unknown as (nextValue: ChipOption[]) => void}
				value={
					value
						? value.map((option) => ({
								label: getOptionLabel(option),
								value: getOptionValue(option),
							}))
						: []
				}
				additional={additional}
				initialAdditional={initialAdditional}
				loadOptions={loadOptions as unknown as LoadOptions<ChipOption, unknown>}
				renderOption={
					renderOption
						? (renderProps, option) =>
								renderOption(
									option as Parameters<typeof renderOption>[0],
									renderProps,
								)
						: undefined
				}
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
				(value || []).map((option) => getOptionValue(option)),
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
			<form {...formProps}>
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
			compact,
			disabled,
			handleRemove,
			title,
			name,
		}) => {
			const testId = `@@list-item/${name}`;

			if (compact) {
				return (
					<div data-testid={testId}>
						{title && <div>{title}</div>}

						<div
							style={{
								display: "grid",
								gap: 6,
								gridTemplateColumns: "1fr auto",
								alignItems: "center",
							}}
						>
							<div
								style={{
									marginLeft: -12,
									marginRight: -12,
								}}
							>
								{children}
							</div>

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
					</div>
				);
			}

			return (
				<CardGrid size="l" data-testid={testId}>
					<ContentCard
						mode={cardMode}
						title={
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
						description={children}
					/>
				</CardGrid>
			);
		},

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
			optionsCacheRef,
			value,
			onChange,
			getOptionLabel,
			getOptionValue,
			renderOption,
		}: MultiSelectRenderProps<OptionType>) => (
			<ChipsSelect
				autoFocus={autoFocus}
				disabled={disabled}
				onChange={(nextSelectValue) => {
					const nextValue: OptionType[] = [];

					for (const selectedChip of nextSelectValue) {
						const selectedOption = optionsCacheRef.current[selectedChip.value];

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
				renderOption={
					renderOption
						? (renderProps, option) =>
								renderOption(
									option as Parameters<typeof renderOption>[0],
									renderProps,
								)
						: undefined
				}
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
			renderOption,
		}) => (
			<Select
				allowClearButton={clearable}
				autoFocus={autoFocus}
				disabled={disabled}
				onChange={(event) => {
					const nextValue = event.target.value;

					const selectedOption = optionsCacheRef.current[nextValue];

					onChange(selectedOption);
				}}
				placeholder={placeholder}
				value={value ? getOptionValue(value) : ""}
				options={options.map((option) => ({
					label: getOptionLabel(option),
					value: getOptionValue(option),
				}))}
				renderOption={
					renderOption
						? (renderProps) =>
								renderOption(
									renderProps.option as Parameters<typeof renderOption>[0],
									renderProps,
								)
						: undefined
				}
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
				value={(value || []).map((option) => ({
					value: option,
					label: option,
				}))}
			/>
		),

		renderTextArea: ({
			disabled,
			autoFocus,
			textAreaProps: { ref, size, defaultValue, ...textAreaProps } = {},
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
}
