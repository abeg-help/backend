import { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

const validateDataWithZod =
	<TSchema extends ZodSchema>(Schema: TSchema) =>
	(req: Request, res: Response, next: NextFunction) => {
		const rawData = req.body;
		const result = Schema.safeParse(rawData);

		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			const message = `${Object.keys(errors).toString()} fields are required!`;
			res.status(422).json({ error: message });
			return;
		}

		req.body = result.data;
		next();
	};

export { validateDataWithZod };
