import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { Response, Request } from 'express';
import stepOne from './create-steps/stepOne';
import stepTwo from './create-steps/stepTwo';

const CreateCampaign = catchAsync(async (req: Request, res: Response) => {
	const { step } = req.params;

	if (!step) {
		throw new AppError('Please Provide a step', 400);
	}

	const steps = {
		one: stepOne,
		two: stepTwo,
		three: '',
	};

	const stepFunction = steps[step];

	if (!stepFunction) {
		throw new AppError('Invalid request', 400);
	}

	return await stepFunction(req, res);
});

export default CreateCampaign;
