import { AppResponse } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { campaignModel as campaign } from '@/models/campaignModel';
import { Request, Response } from 'express';

const secondStep = catchAsync(async (req: Request, res: Response) => {
	const { user } = req;
	const { title, fundraiser, goal } = req.body;
	const { campaignId } = req.params;

	if (!user) {
		throw new AppError('User not found!. Please login');
	}

	if (!title || !fundraiser || !goal) {
		throw new AppError('Please provide the necessary credentials');
	}

	const currentDateDeadline = Date.now();

	const step2Campaign = await campaign.findByIdAndUpdate(
		campaignId,
		{
			title,
			fundraiser,
			goal,
			deadline: currentDateDeadline,
		},
		{ new: true }
	);

	if (!step2Campaign) {
		throw new AppError('Campaign not found', 404);
	}

	AppResponse(res, 200, step2Campaign, 'Step two campaign update successful');
});

export default secondStep;
