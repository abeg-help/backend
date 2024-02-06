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

	const steps = {
		one: stepOne,
		two: stepTwo,
		three: stepThree,
	};

	const stepFunction = steps[step];

	if (!stepFunction) {
		throw new AppError('Invalid request', 400);
	}

	return await stepFunction(req, res);
});
