import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { baseSchema, mainSchema } from '../schemas'; // replace with the actual path to mainSchema

type MyDataShape = z.infer<typeof baseSchema>;

const validateDataWithZod = (req: Request, res: Response, next: NextFunction) => {
	const rawData = req.body as Partial<MyDataShape>;
	if (!rawData) return next();

	// Validate each field in req.body individually
	const errorDetails: { [key: string]: string[] } = {};
	let hasErrors = false;
	for (const key in rawData) {
		if (baseSchema.shape[key]) {
			const result = baseSchema.shape[key].safeParse(rawData[key]);
			if (!result.success) {
				hasErrors = true;
				errorDetails[key] = result.error.errors.map((error) => error.message);
			}
		}
	}

	if (hasErrors) {
		const errorResponse = {
			status: 'error',
			error: 'Validation error',
			details: errorDetails,
		};

		return res.status(422).json(errorResponse);
	}

	// Create a new schema from mainSchema that only includes the fields present in req.body
	// Create a new schema from mainSchema that only includes the fields present in req.body
	// Create a new schema from mainSchema that only includes the fields present in req.body
	const mainKeysObj = Object.fromEntries(Object.keys(rawData).map((key) => [key, true]));
	const mainSchemaObject = mainSchema.innerType() as z.ZodObject<{ [key: string]: z.ZodTypeAny }>;
	const newMainSchemaShape = Object.keys(mainSchemaObject.shape)
		.filter((key) => mainKeysObj[key])
		.reduce(
			(obj, key) => {
				obj[key] = mainSchemaObject.shape[key];
				return obj;
			},
			{} as Record<string, z.ZodTypeAny>
		);
	const newMainSchema = z.object(newMainSchemaShape);

	// Validate req.body against the new mainSchema
	const mainResult = newMainSchema.safeParse(rawData);
	if (!mainResult.success) {
		const errorDetails: { [key: string]: string[] } = {};
		for (const error of mainResult.error.errors) {
			const fieldName = error.path[0];
			if (!errorDetails[fieldName]) {
				errorDetails[fieldName] = [];
			}
			errorDetails[fieldName].push(error.message);
		}

		return res.status(422).json({
			status: 'error',
			error: 'Validation error',
			details: errorDetails,
		});
	} else {
		req.body = mainResult.data as MyDataShape;
	}

	next();
};

export { validateDataWithZod };
