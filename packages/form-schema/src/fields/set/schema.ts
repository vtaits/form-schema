export type SetSchema<FieldSchema> = {
	schemas: Readonly<Record<string, FieldSchema>>;
};
