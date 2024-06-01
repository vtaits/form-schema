import type { ListSchema as ListSchemaBase } from "@vtaits/form-schema/fields/list";
import type { HTMLProps, ReactNode } from "react";
import type { BaseFieldSchema } from "../base";

export type ListSchema = Readonly<
	ListSchemaBase &
		BaseFieldSchema & {
			addButtonLabel?: ReactNode;
			getBlockLabel?: (index: number) => ReactNode;
		}
>;
