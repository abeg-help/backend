import AppError from '@/common/utils/appError';
import firstStep from './stepOne';
import { catchAsync } from '@/middlewares';
import { Response, Request, NextFunction } from 'express';
import { thirdStep } from './stepThree';

const CreateCampaign = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { step } = req.body;
	switch (step) {
		case 'one':
			firstStep(req, res, next);
			break;
		case 'two':
			//add second step
			break;
		case 'three':
			thirdStep(req, res, next);
			break;
		default:
			throw new AppError('Invalid request', 400);
	}
});

export default CreateCampaign;
