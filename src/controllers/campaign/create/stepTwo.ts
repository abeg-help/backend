import { AppError, AppResponse } from '@/common/utils';
import { campaignModel } from '@/models';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';

export const stepTwo = async (req: Request, res: Response) => {
	const { title, fundraiser, goal, deadline } = req.body;
	const { user } = req;
	const { id } = req.query;

	if (!id) {
		throw new AppError('Id is required');
	}

	if (!title || !fundraiser || !goal || !deadline) {
		throw new AppError('Please provide required details', 400);
	}

	const currentDate = new Date();
	const deadlineDate = new Date(deadline);
	const plusOneDay = DateTime.now().plus({ days: 1 }).toJSDate().getTime();

	if (currentDate.getTime() > deadlineDate.getTime()) {
		throw new AppError('Deadline cannot be a past date', 400);
	}

	if (deadlineDate.getTime() < plusOneDay) {
		throw new AppError('Deadline must be more than 1 day from today', 400);
	}

	const updatedCampaign = await campaignModel.findOneAndUpdate(
		{ _id: id, creator: user?._id },
		{
			title,
			fundraiser,
			goal,
			deadline: deadlineDate,
		},
		{ new: true }
	);

	if (!updatedCampaign) {
		throw new AppError(`Unable to process request , try again later`, 404);
	}

	AppResponse(res, 200, updatedCampaign, 'Proceed to step 3');
};
