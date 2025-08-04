import type { ListSchema as ListSchemaBase } from "@vtaits/form-schema/fields/list";
import type { ListItemWrapperRenderProps } from "@vtaits/react-form-schema-base-ui";
import type { ReactNode } from "react";
import type { BaseFieldSchema, FormApi } from "../base";

export type ListSchema<FieldSchema> = Readonly<
	ListSchemaBase<FormApi, FieldSchema> &
		BaseFieldSchema & {
			addButtonLabel?: ReactNode;
			getBlockLabel?: (index: number) => ReactNode;
			compact?: boolean;
			inline?: boolean;
			renderListItemWrapper?: (
				renderProps: ListItemWrapperRenderProps,
			) => ReactNode;
		}
>;
