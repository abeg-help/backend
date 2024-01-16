import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { Response, Request } from 'express';
import stepOne from './stepOne';

const CreateCampaign = catchAsync(async (req: Request, res: Response) => {
	const step = req.params.step;
	if (!step) {
		throw new AppError('Please Provide a step', 400);
	}
	switch (step) {
		case 'one':
			await stepOne(req, res);
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

export default CreateCampaign;
