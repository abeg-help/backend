import AppError from '@/common/utils/appError';
import firstStep from './stepOne';
import secondStep from './stepTwo';
import { catchAsync } from '@/middlewares';
import { Response, Request, NextFunction } from 'express';

const CreateCampaign = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { step } = req.body;
	switch (step) {
		case 'one':
			firstStep(req, res, next);
			break;
		case 'two':
			secondStep(req, res, next);
			break;
		case 'three':
			// add third step
			break;
		default:
			throw new AppError('Invalid request', 400);
	}
});

export default CreateCampaign;
