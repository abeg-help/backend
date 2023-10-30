import { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

interface ErrorField {
	[field: string]: string | string[] | undefined;
}

const validateDataWithZod =
	<TSchema extends ZodSchema>(Schema: TSchema) =>
	(req: Request, res: Response, next: NextFunction) => {
		const rawData = req.body;
		const result = Schema.safeParse(rawData);
		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			const error: ErrorField[] = [];
			for (const [field, err] of Object.entries(errors)) {
				error.push({ [field]: err });
			}
			res.status(422).json({ error });
			return;
		}

		req.body = result.data;
		next();
	};

export { validateDataWithZod };
