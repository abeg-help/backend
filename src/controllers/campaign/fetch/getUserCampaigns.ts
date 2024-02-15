import { AppError, AppResponse, QueryHandler } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { campaignModel } from '@/models';
import { Request, Response } from 'express';

export const stepOne = catchAsync(async (req: Request, res: Response) => {
	const { user, query } = req;

	if (!user) {
		throw new AppError('User not found!', 400);
	}
	// Create a new QueryHandler instance
	const features = new QueryHandler(campaignModel.find({ creator: user._id }), query);

	// Enable all features
	const campaigns = await features.filter().sort().limitFields().paginate().execute();

	AppResponse(res, 200, campaigns, 'Proceed to step 2');
});
