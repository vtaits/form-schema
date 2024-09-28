import type { BaseFieldSchema } from "../base";

export type FileFieldValue = {
	file: Blob | null | undefined;
	name?: string;
	hasPreviousFile: boolean;
};

export type FileSchema<FormApi> = BaseFieldSchema<FormApi, FileFieldValue> & {
	/**
	 * input accept attribute
	 */
	accept?: string;
	/**
	 * max size in bytes
	 */
	maxSize?: number;
	/**
	 * min size in bytes
	 */
	minSize?: number;
};
