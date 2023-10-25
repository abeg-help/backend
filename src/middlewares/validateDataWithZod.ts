import { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

const validateDataWithZod =
	<TSchema extends ZodSchema>(Schema: TSchema) =>
	(req: Request, res: Response, next: NextFunction) => {
		const rawData = req.body;
		const result = Schema.safeParse(rawData);

		if (!result.success) {
			const zodErrors = { errors: result.error.flatten().fieldErrors };

			res.status(422).json(zodErrors);
			return;
		}

		req.body = result.data;
		next();
	};

export { validateDataWithZod };
