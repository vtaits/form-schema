import type {
	AsyncMultiSelectSchema,
	AsyncSelectSchema,
} from "../fields/asyncSelect";
import type { CheckboxSchema } from "../fields/checkbox";
import type { CheckboxGroupSchema } from "../fields/checkboxGroup";
import type { DateSchema } from "../fields/date";
import type { DateTimeSchema } from "../fields/datetime";
import type { DynamicSchema } from "../fields/dynamic";
import type { FileSchema } from "../fields/file";
import type { InputSchema } from "../fields/input";
import type { ListSchema } from "../fields/list";
import type { RadioGroupSchema } from "../fields/radioGroup";
import type { MultiSelectSchema, SelectSchema } from "../fields/select";
import type { SetSchema } from "../fields/set";
import type { TagsSchema } from "../fields/tags";
import type { TextAreaSchema } from "../fields/textarea";

export type DefaultFieldSchema<
	FieldSchema,
	Values extends Record<string, any> = Record<string, any>,
	RawValues extends Record<string, any> = Record<string, any>,
	SerializedValues extends Record<string, any> = Record<string, any>,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
> =
	| FieldSchema
	| (AsyncMultiSelectSchema & {
			type: "asyncMultiSelect";
	  })
	| (AsyncSelectSchema & {
			type: "asyncSelect";
	  })
	| (CheckboxSchema & {
			type: "checkbox";
	  })
	| (CheckboxGroupSchema & {
			type: "checkboxGroup";
	  })
	| (DateSchema & {
			type: "date";
	  })
	| (DateTimeSchema & {
			type: "datetime";
	  })
	| (DynamicSchema<any, Values, RawValues, SerializedValues, Errors> & {
			type: "dynamic";
	  })
	| (FileSchema & {
			type: "file";
	  })
	| (InputSchema & {
			type: "input";
	  })
	| (RadioGroupSchema & {
			type: "radioGroup";
	  })
	| (MultiSelectSchema & {
			type: "multiSelect";
	  })
	| (SelectSchema & {
			type: "select";
	  })
	| (SetSchema<any, Values, Payload> & {
			type: "set";
	  })
	| (TagsSchema & {
			type: "tags";
	  })
	| (ListSchema<any> & {
			type: "list";
	  })
	| (TextAreaSchema & {
			type: "textarea";
	  });
