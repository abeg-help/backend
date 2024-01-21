import { AppResponse } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { Request, Response } from 'express';
import { campaignModel as campaign } from '@/models/campaignModel';
import { DateTime } from 'luxon';

const deleteCampaign = catchAsync(async (req: Request, res: Response) => {
	const { user } = req;

	if (!user) {
		throw new AppError('User not found!. Please login');
	}

	const { campaignId } = req.params;
	const updatedCampaign = await campaign.findByIdAndUpdate(campaignId, {
		deletedDate: DateTime.now(),
	});

	if (!updatedCampaign) {
		throw new AppError('Campaign not found', 404);
	}

	AppResponse(res, 200, null, 'Campaign deleted successfully');
});

export default deleteCampaign;
