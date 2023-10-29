import { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

const validateDataWithZod =
	<TSchema extends ZodSchema>(Schema: TSchema) =>
	(req: Request, res: Response, next: NextFunction) => {
		const rawData = req.body;
		const result = Schema.safeParse(rawData);

		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			let message = '';
			for (const [key, value] of Object.entries(errors)) {
				if (value?.includes('Required')) {
					message += `${key} is ${value} \n`;
				} else {
					message += `${key}: ${value} \n`;
				}
			}
			res.status(422).json({ error: message });
			return;
		}

		req.body = result.data;
		next();
	};

export { validateDataWithZod };
