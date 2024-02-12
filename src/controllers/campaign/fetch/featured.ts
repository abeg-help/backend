import { AppResponse, QueryHandler } from '@/common/utils';
import { campaignModel } from '@/models';
import { Request, Response } from 'express';

export const stepOne = async (req: Request, res: Response) => {
	const { query } = req;

	// Create a new QueryHandler instance
	const features = new QueryHandler(campaignModel.find({ featured: true }), query);

	// Enable all features
	const campaigns = await features.filter().sort().limitFields().paginate().execute();

	AppResponse(res, 200, campaigns, 'Featured campaigns fetched successfully!');
};

//1. fetch a single campaign
//2. fetch featured campaigns
//3. fetch all campaigns by a user
//4. fetch a single campaign a user
//5. fetch all campaigns by a admin
//6. fetch all campaigns

//campaigns/get?featured=false&campaignType=public&limit=10&page=1&sort=-createdAt&fields=-__v
