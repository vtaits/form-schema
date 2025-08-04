import { Icon16Attach } from "@vkontakte/icons";
import {
	CardGrid,
	type CardProps,
	ContentCard,
	Counter,
	Footnote,
	FormItem,
	FormStatus,
	Title,
} from "@vkontakte/vkui";
import { DEFAULT_DISPLAY_DATE_FORMAT as defaultDateFormat } from "@vtaits/form-schema/fields/date";
import { DEFAULT_DISPLAY_DATE_FORMAT as defaultDatetimeFormat } from "@vtaits/form-schema/fields/datetime";
import type { BaseUIContextValue } from "@vtaits/react-form-schema-base-ui";
import { format } from "date-fns/format";
import type { PropsWithChildren } from "react";

function Flex({
	gap,
	children,
}: PropsWithChildren<{
	gap?: "s";
}>) {
	return (
		<div
			style={{
				display: "flex",
				flexWrap: "wrap",
				gap: gap === "s" ? 6 : undefined,
			}}
		>
			{children}
		</div>
	);
}

export type IGetContextValusParams = {
	cardMode?: CardProps["mode"];
};

export function getContextValue({
	cardMode,
}: IGetContextValusParams): BaseUIContextValue {
	return {
		renderAsyncSelect: ({ value, getOptionLabel }) => {
			if (value) {
				return getOptionLabel(value);
			}

			return null;
		},

		renderAsyncMultiSelect: ({ value, getOptionLabel, getOptionValue }) => {
			if (value) {
				return (
					<Flex gap="s">
						{value.map((option) => (
							<Counter key={getOptionValue(option)}>
								{getOptionLabel(option)}
							</Counter>
						))}
					</Flex>
				);
			}

			return null;
		},

		renderCheckbox: ({ checked }) => {
			if (checked) {
				return "Да";
			}

			return "Нет";
		},

		renderCheckboxGroup: ({ value, getOptionLabel, getOptionValue }) => {
			if (value) {
				return (
					<Flex gap="s">
						{value.map((option) => (
							<Counter key={getOptionValue(option)}>
								{getOptionLabel(option)}
							</Counter>
						))}
					</Flex>
				);
			}

			return null;
		},

		renderDatePicker: ({ value, displayDateFormat = defaultDateFormat }) => {
			if (value) {
				return format(value, displayDateFormat);
			}

			return null;
		},

		renderDateTimePicker: ({
			value,
			displayDateFormat = defaultDatetimeFormat,
		}) => {
			if (value) {
				return format(value, displayDateFormat);
			}

			return null;
		},

		renderFileInput: ({ selectedFile }) => {
			if (selectedFile) {
				// TO DO: link
				return (
					<p
						style={{
							display: "flex",
							alignItems: "center",
							gap: "10px",
						}}
					>
						<Icon16Attach />
						{selectedFile}
					</p>
				);
			}

			return null;
		},

		renderForm: ({ actions, error, fields, title }) => (
			<div>
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
			</div>
		),

		renderInput: ({ inputProps: { value } = {} }) => {
			return value;
		},

		renderListAddButton: () => null,

		renderListItemWrapper: ({ children, title, name }) => (
			<CardGrid size="l" data-testid={`@@list-item/${name}`}>
				<ContentCard
					mode={cardMode}
					header={
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<div>{title}</div>
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

		renderMultiSelect: ({ value, getOptionLabel, getOptionValue }) => {
			if (value) {
				return (
					<Flex gap="s">
						{value.map((option) => (
							<Counter key={getOptionValue(option)}>
								{getOptionLabel(option)}
							</Counter>
						))}
					</Flex>
				);
			}

			return null;
		},

		renderRadioGroup: ({ value, getOptionLabel }) => {
			if (value) {
				return getOptionLabel(value);
			}

			return null;
		},

		renderSelect: ({ value, getOptionLabel }) => {
			if (value) {
				return getOptionLabel(value);
			}

			return null;
		},

		renderTags: ({ value }) => {
			return (
				<Flex gap="s">
					{value.map((tag, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: there is no id
						<Counter key={index}>{tag}</Counter>
					))}
				</Flex>
			);
		},

		renderTextArea: ({ textAreaProps: { defaultValue, value } = {} }) => (
			<div
				style={{
					whiteSpace: "pre-wrap",
				}}
			>
				{String(value ?? defaultValue)}
			</div>
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
