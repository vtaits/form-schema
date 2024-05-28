export type SetSchema<FieldSchema> = {
	schemas: Readonly<Record<string | number | symbol, FieldSchema>>;
	nested?: boolean;
};
