import { AppResponse, QueryHandler } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { campaignModel } from '@/models';
import { Request, Response } from 'express';

export const featuredCampaigns = catchAsync(async (req: Request, res: Response) => {
	const { query } = req;

	// Create a new QueryHandler instance
	const features = new QueryHandler(campaignModel.find({ featured: true }), query);

	// Enable all features
	const campaigns = await features.filter().sort().limitFields().paginate().populateFields().execute();

	AppResponse(res, 200, campaigns, 'Featured campaigns fetched successfully!');
});
