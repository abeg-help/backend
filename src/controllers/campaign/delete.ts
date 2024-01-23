import { AppResponse } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { Request, Response } from 'express';
import { campaignModel as campaign } from '@/models/campaignModel';
import { DateTime } from 'luxon';
import { IUser } from '@/common/interfaces';

const deleteCampaign = catchAsync(async (req: Request, res: Response) => {
	const { campaignId } = req.params;
	const { user: loggedInUserId } = req;

	const campaignDoc = await campaign.findById(campaignId).populate('creator');

	if (!campaignDoc) {
		throw new AppError('Campaign not found', 404);
	}

	const creatorId = (campaignDoc.creator as IUser)._id;

	if (loggedInUserId !== creatorId.toString()) {
		throw new AppError('You are not authorized to delete this campaign', 403);
	}

	const updatedCampaign = await campaign.findByIdAndUpdate(campaignId, {
		deletedDate: DateTime.now(),
	});

	if (!updatedCampaign) {
		throw new AppError('Campaign not found', 404);
	}

	AppResponse(res, 200, null, 'Campaign deleted successfully');
});

export default deleteCampaign;
