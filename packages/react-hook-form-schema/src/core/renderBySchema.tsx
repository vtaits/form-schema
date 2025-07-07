import type {
	BaseValues,
	FieldSchemaBase,
	GetFieldSchema,
	ParentType,
} from "@vtaits/form-schema";
import { isEqual, isPromise } from "es-toolkit";
import {
	type ReactElement,
	type ReactNode,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useAsync } from "react-async-hook";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { getFieldPath } from "./getFieldPath";
import type { FieldSchemaWithRenderBase, GetFieldType } from "./types";

type IFieldProxyProps<
	FieldSchema extends FieldSchemaWithRenderBase,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
> = {
	formResult: UseFormReturn<Values, TContext, Values>;
	getFieldSchema: GetFieldSchema<FieldSchema>;
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload,
		TContext
	>;
	getValues: () => FieldValues;
	name: string;
	payload?: Payload;
	parents?: readonly ParentType<Values>[];
};

function FieldProxy<
	FieldSchema extends FieldSchemaWithRenderBase,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
>({
	formResult,
	getFieldSchema,
	getFieldType,
	getValues,
	name,
	payload = undefined,
	parents = undefined,
}: IFieldProxyProps<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors,
	Payload,
	TContext
>): ReactElement | null {
	const fieldSchema = getFieldSchema(name);
	const fieldType = getFieldType(fieldSchema);

	const { createGetFieldSchema } = fieldType;

	const render =
		(fieldSchema.render as unknown as typeof fieldType.render) ||
		fieldType.render;

	const values = getValues() as Values;

	const providedParents = parents || [
		{
			values,
		},
	];

	if (fieldSchema.getDependencies) {
		formResult.watch();
	}

	const dependencies = fieldSchema.getDependencies?.({
		values,
		phase: "render",
		getFieldSchema,
		getFieldType: getFieldType as unknown as GetFieldType<
			FieldSchemaBase,
			BaseValues,
			BaseValues,
			BaseValues,
			Record<string, any>
		>,
		parents: providedParents,
	});

	const countCreateGetFieldSchema = () => {
		if (createGetFieldSchema) {
			return createGetFieldSchema({
				fieldSchema,
				getFieldSchema,
				getFieldType,
				values,
				phase: "render",
				parents: providedParents,
				dependencies,
			});
		}

		return getFieldSchema;
	};

	const [createGetFieldSchemaResult, setCreateGetFieldSchemaResult] = useState(
		() => countCreateGetFieldSchema(),
	);

	const { result: createGetFieldSchemaResultAsync } = useAsync(async () => {
		const res = await createGetFieldSchemaResult;
		return res;
	}, [createGetFieldSchemaResult]);

	const childGetFieldSchema = useMemo(() => {
		if (isPromise(createGetFieldSchemaResult)) {
			return createGetFieldSchemaResultAsync;
		}

		return createGetFieldSchemaResult;
	}, [createGetFieldSchemaResult, createGetFieldSchemaResultAsync]);

	const isFirstRenderCheckDependenciesRef = useRef(true);
	const prevDependenciesRef = useRef(dependencies);

	// biome-ignore lint/correctness/useExhaustiveDependencies: trigger only on dependencies change
	useEffect(() => {
		if (isFirstRenderCheckDependenciesRef.current) {
			isFirstRenderCheckDependenciesRef.current = false;
			return;
		}

		if (!isEqual(prevDependenciesRef.current, dependencies)) {
			setCreateGetFieldSchemaResult(countCreateGetFieldSchema());

			prevDependenciesRef.current = dependencies;
		}
	}, [dependencies]);

	if (!childGetFieldSchema) {
		return null;
	}

	return render(
		{
			fieldPath: getFieldPath(name, providedParents) as Path<Values>,
			name,
			payload,
			parents: providedParents,
			getFieldSchema: childGetFieldSchema,
			getFieldType,
			fieldSchema,
			dependencies,
		},
		formResult,
	) as ReactElement;
}

export function renderBySchema<
	FieldSchema extends FieldSchemaWithRenderBase,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
>(
	formResult: UseFormReturn<Values, TContext, Values>,
	getFieldSchema: GetFieldSchema<FieldSchema>,
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload,
		TContext
	>,
	getValues: () => FieldValues,
	name: string,
	payload?: Payload,
	parents?: readonly ParentType<Values>[],
): ReactNode {
	return (
		<FieldProxy
			formResult={formResult}
			getFieldSchema={getFieldSchema}
			getFieldType={getFieldType}
			getValues={getValues}
			name={name}
			payload={payload}
			parents={parents}
		/>
	);
}
