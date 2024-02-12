import { Role } from '@/common/constants';
import { AppError, AppResponse } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { campaignModel } from '@/models';
import { Request, Response } from 'express';

export const deleteCampaign = catchAsync(async (req: Request, res: Response) => {
	const { campaignId } = req.body;
	const { user } = req;

	if (!campaignId) {
		throw new AppError('Please Provide a campaign id', 400);
	}

	if (!user) {
		throw new AppError('Unauthorized, kindly login again.');
	}

	const deletedCampaign = await campaignModel.findOneAndUpdate(
		{
			_id: campaignId,
			...(user.role === Role.User && { creator: user._id }), // only allow user to delete their own campaign if not SuperUser | Admin
		},
		{ $set: { isDeleted: true } }
	);

	if (!deletedCampaign) {
		throw new AppError('Campaign not found', 404);
	}

	return AppResponse(res, 200, null, 'Campaign deleted successfully');
});
