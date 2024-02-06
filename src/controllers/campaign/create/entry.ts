import { AppError } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { Request, Response } from 'express';
import { stepOne } from './stepOne';
import { stepThree } from './stepThree';
import { stepTwo } from './stepTwo';

export const createCampaign = catchAsync(async (req: Request, res: Response) => {
	const { step } = req.params;

	if (!step) {
		throw new AppError('Please Provide a step', 400);
	}

	// Opted for map instead of a simple object lookup or switch to mitigate against DoS attacks
	//REF: https://cwe.mitre.org/data/definitions/754.html
	//REF: https://owasp.org/www-community/attacks/Denial_of_Service

	const steps = new Map([
		['one', stepOne],
		['two', stepTwo],
		['three', stepThree],
	]);

	if (!steps.has(step)) {
		throw new AppError('Step is invalid!', 400);
	}

	const stepFunction = steps.get(step);

	if (typeof stepFunction === 'function') {
		return await stepFunction(req, res);
	} else {
		throw new AppError('Step function not found', 500);
	}
});
