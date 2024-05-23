export type ListSchema<FieldSchema> = {
  maxLength?: number;
	minLength?: number;
  itemSchema: FieldSchema;
};
