import { Col, Row } from "antd";
import type { PropsWithChildren, ReactElement, ReactNode } from "react";

const wrapperStyle = {
	marginBottom: "24px",
};

type FieldRowProps = Readonly<
	PropsWithChildren<{
		label?: ReactNode;
	}>
>;

export function FieldRow({ children, label }: FieldRowProps): ReactElement {
	return (
		<div className="ant-form-item" style={wrapperStyle}>
			<Row className="ant-form-item-row">
				<Col xs={8} className="ant-form-item-label">
					{label}
				</Col>

				<Col xs={16} className="ant-form-item-control">
					{children}
				</Col>
			</Row>
		</div>
	);
}
