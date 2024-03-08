import { AppError } from '@/common/utils';
import { partialMainSchema, mainSchema } from '@/schemas';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { catchAsync } from './catchAsyncErrors';

type MyDataShape = z.infer<typeof mainSchema>;

const methodsToSkipValidation = ['GET'];
const routesToSkipValidation = ['/api/v1/auth/signin', '/api/v1/payment-hook/paystack/donation/verify'];

export const validateDataWithZod = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	// skip validation for defined methods and routes
	if (methodsToSkipValidation.includes(req.method) || routesToSkipValidation.includes(req.url)) {
		return next();
	}

	const rawData = req.body as Partial<MyDataShape>;

	if (!rawData) return next();

	// Validate only if it contains the fields in req.body against the mainSchema
	const mainResult = partialMainSchema.safeParse(rawData);
	if (!mainResult.success) {
		const errorDetails = mainResult.error.formErrors.fieldErrors;
		throw new AppError('Validation failed', 422, errorDetails);
	} else {
		// this ensures that only fields defined in the mainSchema are passed to the req.body
		req.body = mainResult.data as Partial<MyDataShape>;
	}

	next();
});
