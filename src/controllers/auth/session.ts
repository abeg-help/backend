import { AppError, AppResponse, toJSON } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { campaignModel } from '@/models';
import { Request, Response } from 'express';

export const session = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user;
	if (!currentUser) {
		throw new AppError('Unauthenticated', 401);
	}

	const campaigns = await campaignModel.find({ creator: currentUser._id }).sort({ createdAt: -1 }).limit(10);
	return AppResponse(res, 200, { campaigns, user: toJSON(currentUser) }, 'Authenticated');
});
