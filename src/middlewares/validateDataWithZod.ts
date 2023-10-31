import { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

const validateDataWithZod =
	<TSchema extends ZodSchema>(Schema: TSchema) =>
	(req: Request, res: Response, next: NextFunction) => {
		const rawData = req.body;
		if (!rawData)
			return res.status(400).json({
				status: 'error',
				error: 'No data provided',
			});
		const result = Schema.safeParse(rawData);
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

		req.body = result.data;
		next();
	};

export { validateDataWithZod };
