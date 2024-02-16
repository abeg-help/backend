import { Role } from '@/common/constants';
import { AppResponse, QueryHandler, authenticate, setCookie } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { campaignModel } from '@/models';
import { Request, Response } from 'express';
import { sanitize } from 'express-mongo-sanitize';

export const getAllCampaigns = catchAsync(async (req: Request, res: Response) => {
	const query = sanitize(req.query);
	const { userId } = sanitize(req.params);

	// TODO:
	// Add geographic location filter
	// Add personalization filter based on 'Donation history', 'gender', 'trending', 'boosted' etc
	// Might need to be an aggregation pipeline in the future

	let queryObj = {};

	if (userId) {
		// check user auth status
		// get the cookies from the request headers
		const { abegAccessToken, abegRefreshToken } = req.cookies;

		const { currentUser, accessToken } = await authenticate({ abegAccessToken, abegRefreshToken });

		//update the access token if it has been refreshed
		if (accessToken) {
			setCookie(res, 'abegAccessToken', accessToken, {
				maxAge: 15 * 60 * 1000, // 15 minutes
			});
		}

		// use param value if user is a super user or the current user if they are not
		queryObj = { creator: currentUser.role === Role.SuperUser ? userId : currentUser._id };
	}

	// Create a new QueryHandler instance
	const features = new QueryHandler(campaignModel.find(queryObj), query);

	// Enable all features
	const campaigns = await features.filter().sort().limitFields().paginate().execute();

	AppResponse(res, 200, campaigns, 'Campaigns fetched successfully!');
});
