import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny, z } from 'zod';
import { baseSchema, mainSchema } from '../schemas'; // replace with the actual path to mainSchema

type MyDataShape = z.infer<typeof baseSchema>;

const validateDataWithZod = (req: Request, res: Response, next: NextFunction) => {
	const rawData = req.body as Partial<MyDataShape>;
	if (!rawData) return next();

	// Create a new schema that only includes the fields present in req.body
	const keys = Object.keys(rawData);
	const newSchemaShape: { [key: string]: ZodTypeAny } = {};
	keys.forEach((key) => {
		if (baseSchema.shape[key]) {
			newSchemaShape[key] = baseSchema.shape[key];
		}
	});
	const newSchema = z.object(newSchemaShape).partial(); // Make all fields optional

	// Validate req.body against the new schema
	const result = newSchema.safeParse(rawData);
	if (!result.success) {
		const errorDetails: { [key: string]: string[] } = {};
		for (const error of result.error.errors) {
			const fieldName = error.path[0];
			if (!errorDetails[fieldName]) {
				errorDetails[fieldName] = [];
			}
			errorDetails[fieldName].push(error.message);
		}

		const errorResponse = {
			status: 'error',
			error: 'Validation error',
			details: errorDetails,
		};

		return res.status(422).json(errorResponse);
	}

	// Apply the additional validation rules from mainSchema
	const mainResult = mainSchema.safeParse(result.data);
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
