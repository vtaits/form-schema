import { format } from "date-fns/format";
import { isValid } from "date-fns/isValid";
import { parse } from "date-fns/parse";
import { type ReactNode, createContext, useCallback, useMemo } from "react";
import type { LoadOptions } from "select-async-paginate-model";
import { useSelectAsyncPaginate } from "use-select-async-paginate";
import type {
	AsyncMultiSelectRenderProps,
	BaseUIContextValue,
	MultiSelectRenderProps,
} from "./types";

const DATE_FORMAT = "yyyy-MM-dd";
const DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm";

function AsyncOptions<OptionType, Additional>({
	initialAdditional,
	additional,
	getOptionLabel,
	getOptionValue,
	loadOptions,
	selectedValuesSet,
	render,
}: {
	initialAdditional?: Additional;
	additional?: Additional;
	getOptionLabel: (option: OptionType) => string;
	getOptionValue: (option: OptionType) => string | number;
	loadOptions: LoadOptions<OptionType, Additional>;
	selectedValuesSet?: Set<string | number>;
	render: (children: {
		children: ReactNode;
	}) => ReactNode;
}) {
	const [currentCache, _model] = useSelectAsyncPaginate({
		autoload: true,
		initialAdditional,
		additional,
		loadOptions,
	});

	const { options } = currentCache;

	const children = useMemo(
		() =>
			options.map((option) => {
				const optionValue = getOptionValue(option);

				return (
					<option
						selected={
							selectedValuesSet ? selectedValuesSet.has(optionValue) : undefined
						}
						key={optionValue}
						value={optionValue}
					>
						{getOptionLabel(option)}
					</option>
				);
			}),
		[getOptionLabel, getOptionValue, options, selectedValuesSet],
	);

	return render({
		children,
	});
}

export const BaseUIContext = createContext<BaseUIContextValue>({
	renderAsyncSelect: ({
		clearable,
		disabled,
		autoFocus,
		name,
		initialAdditional,
		additional,
		optionsCacheRef,
		loadOptions,
		placeholder,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}) => (
		<AsyncOptions
			initialAdditional={initialAdditional}
			additional={additional}
			getOptionLabel={getOptionLabel}
			getOptionValue={getOptionValue}
			loadOptions={loadOptions}
			render={({ children }) => (
				<select
					disabled={disabled}
					name={name}
					onChange={(event) => {
						const nextValue = event.target.value;

						const selectedOption = optionsCacheRef.current[nextValue];

						onChange(selectedOption);
					}}
					value={value ? getOptionValue(value) : ""}
				>
					{clearable && <option value="">{placeholder}</option>}

					{children}
				</select>
			)}
		/>
	),

	renderAsyncMultiSelect: <OptionType, Additional>({
		disabled,
		autoFocus,
		name,
		initialAdditional,
		additional,
		optionsCacheRef,
		loadOptions,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}: AsyncMultiSelectRenderProps<OptionType, Additional>) => {
		const selectedValuesSet = new Set(
			(value || []).map((option) => getOptionValue(option)),
		);

		return (
			<AsyncOptions
				initialAdditional={initialAdditional}
				additional={additional}
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				loadOptions={loadOptions}
				selectedValuesSet={selectedValuesSet}
				render={({ children }) => (
					<select
						disabled={disabled}
						multiple
						name={name}
						onChange={(event) => {
							const nextValue: OptionType[] = [];

							for (const option of Array.from(event.target.options)) {
								if (option.selected) {
									const selectedOption = optionsCacheRef.current[option.value];

									if (selectedOption) {
										nextValue.push(selectedOption);
									}
								}
							}

							onChange(nextValue);
						}}
					>
						{children}
					</select>
				)}
			/>
		);
	},

	renderCheckbox: ({
		checked,
		disabled,
		autoFocus,
		name,
		onChange,
		children,
	}) => (
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
			(value || []).map((option) => getOptionValue(option)),
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

	renderDatePicker: ({ disabled, inputProps, autoFocus, onChange, value }) => (
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

	renderDateTimePicker: ({
		disabled,
		inputProps,
		autoFocus,
		onChange,
		value,
	}) => (
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

	renderFileInput: ({ accept, disabled, name, onSelectFile, selectedFile }) => (
		<>
			<input
				accept={accept}
				disabled={disabled}
				name={name}
				type="file"
				onChange={(event) => {
					onSelectFile(event.target.files?.[0] || null);
					event.target.value = "";
				}}
			/>

			{selectedFile && (
				<p>
					{selectedFile}{" "}
					<button
						disabled={disabled}
						type="button"
						onClick={() => {
							onSelectFile(null);
						}}
					>
						Remove
					</button>
				</p>
			)}
		</>
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
					data-testid="@@form/error"
				>
					{error}
				</p>
			)}

			<div>{actions}</div>
		</form>
	),

	renderInput: ({
		disabled,
		inputProps,
		autoFocus,
		onChange,
		options,
		name,
	}) => {
		if (options && options.length > 0) {
			const listId = `${name}-datalist`;

			return (
				<>
					<input
						list={`${name}-datalist`}
						name={name}
						disabled={disabled}
						{...inputProps}
						onChange={({ target: { value } }) => {
							onChange(value);
						}}
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
			<input
				name={name}
				disabled={disabled}
				{...inputProps}
				onChange={({ target: { value } }) => {
					onChange(value);
				}}
			/>
		);
	},

	renderListAddButton: ({ children, onClick, disabled }) => (
		<button data-testid="@@list/add" type="button" onClick={onClick}>
			{children}
		</button>
	),

	renderListItemWrapper: ({
		children,
		disabled,
		handleRemove,
		title,
		name,
	}) => (
		<fieldset data-testid={`@@list-item/${name}`}>
			{title && <legend>{title}</legend>}

			{children}

			{handleRemove && (
				<button disabled={disabled} type="button" onClick={handleRemove}>
					Remove
				</button>
			)}
		</fieldset>
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
		<div data-testid={`@@list/${name}`}>
			{(label || required) && (
				// biome-ignore lint/a11y/noLabelWithoutControl: list has no associated input
				<label>
					{label}{" "}
					{required && (
						<span
							style={{
								color: "red",
							}}
						>
							*
						</span>
					)}
				</label>
			)}

			<div role="list">{items}</div>

			{hint && (
				<p
					style={{
						color: "gray",
					}}
					data-testid={`@@hint/${name}`}
				>
					{hint}
				</p>
			)}

			{actions && <div>{actions}</div>}

			{error && (
				<p
					style={{
						color: "red",
					}}
					data-testid={`@@error/${name}`}
				>
					{error}
				</p>
			)}
		</div>
	),

	renderMultiSelect: <OptionType,>({
		disabled,
		autoFocus,
		name,
		options,
		optionsCacheRef,
		value,
		onChange,
		getOptionLabel,
		getOptionValue,
	}: MultiSelectRenderProps<OptionType>) => {
		const selectedValuesSet = new Set(
			(value || []).map((option) => getOptionValue(option)),
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
							const selectedOption = optionsCacheRef.current[option.value];

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
		autoFocus,
		name,
		options,
		optionsCacheRef,
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

				const selectedOption = optionsCacheRef.current[nextValue];

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

	renderTags: ({ disabled, autoFocus, name, onChange, value }) => (
		<input
			disabled={disabled}
			name={name}
			onChange={(event) => {
				onChange(event.target.value.split(","));
			}}
			value={value.join(",")}
		/>
	),

	renderTextArea: ({ disabled, autoFocus, name, textAreaProps }) => (
		<textarea disabled={disabled} name={name} {...textAreaProps} />
	),

	renderWrapper: ({ children, error, hint, label, name, required }) => (
		<div>
			{(label || required) && (
				// biome-ignore lint/a11y/noLabelWithoutControl: TO DO
				<label>
					{label}{" "}
					{required && (
						<span
							style={{
								color: "red",
							}}
						>
							*
						</span>
					)}
				</label>
			)}

			{children}

			{hint && (
				<p
					style={{
						color: "gray",
					}}
					data-testid={`@@hint/${name}`}
				>
					{hint}
				</p>
			)}

			<p
				style={{
					color: "red",
				}}
				data-testid={`@@error/${name}`}
			>
				{error}
			</p>
		</div>
	),
});
