import AppError from '@/common/utils/appError';
import firstStep from './stepOne';
import { catchAsync } from '@/queues/middlewares';
import { Response, Request, NextFunction } from 'express';

const General = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const step = req.body.step;
	switch (step) {
		case 'one':
			firstStep(req, res, next);
			break;
		case 'two':
			//add second step
			break;
		case 'three':
			// add third step
			break;
		default:
			throw new AppError('Invalid request', 400);
	}
});

export default General;
