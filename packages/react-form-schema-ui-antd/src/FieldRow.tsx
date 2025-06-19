import { Form } from "antd";
import type { PropsWithChildren, ReactElement, ReactNode } from "react";

const wrapperStyle = {
	marginBottom: "24px",
};

type FieldRowProps = Readonly<
	PropsWithChildren<{
		"data-testid"?: string;
		label?: ReactNode;
		required?: boolean;
	}>
>;

export function FieldRow({
	children,
	"data-testid": testId,
	label,
	required,
}: FieldRowProps): ReactElement {
	return (
		<Form.Item
			colon={Boolean(label)}
			style={wrapperStyle}
			labelCol={{
				span: 8,
			}}
			wrapperCol={{
				span: 16,
			}}
			label={label || <noscript />}
			data-testid={testId}
			required={required}
		>
			{children}
		</Form.Item>
	);
}
