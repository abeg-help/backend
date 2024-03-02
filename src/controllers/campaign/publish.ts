import { Role, StatusEnum } from '@/common/constants';
import { AppError, AppResponse } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { campaignModel } from '@/models';
import { Request, Response } from 'express';

export const publishCampaign = catchAsync(async (req: Request, res: Response) => {
	const { campaignId } = req.body;
	const { user } = req;

	if (!campaignId) {
		throw new AppError('Please Provide a campaign id', 400);
	}

	if (!user) {
		throw new AppError('Unauthorized, kindly login again.');
	}

	const publishCampaign = await campaignModel.findOneAndUpdate(
		{
			_id: campaignId,
			...(user.role === Role.User && { creator: user._id }), // only allow user to publish their own campaign if not SuperUser | Admin
			status: StatusEnum.APPROVED, // only publish campaign if campaign has already been approved!
		},
		{ $set: { isPublished: true } }
	);

	if (!publishCampaign) {
		throw new AppError('Campaign not found or status not been approved', 400);
	}

	return AppResponse(res, 200, publishCampaign, 'Campaign published successfully');
});
