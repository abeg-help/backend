import { ICampaign } from '@/common/interfaces';
import { AppResponse, getFromCache, setCache } from '@/common/utils';
import { campaignModel } from '@/models';
import { Request, Response } from 'express';
import { Require_id } from 'mongoose';

export const getOneCampaign = async (req: Request, res: Response) => {
	const { campaignId } = req.body;

	if (!campaignId) {
		return AppResponse(res, 400, null, 'Please provide a campaign url');
	}

	// fetch from cache
	const cachedCampaign = await getFromCache<Require_id<ICampaign>>(campaignId);

	// fetch from DB if not previously cached
	const campaign = cachedCampaign
		? cachedCampaign
		: ((await campaignModel.findOne({ _id: campaignId })) as Require_id<ICampaign>);

	// cache for 24 hours if not previously cached
	if (!cachedCampaign) {
		await setCache(campaign._id.toString(), campaign, 60 * 60 * 24);
	}

	AppResponse(res, 200, campaign, 'Campaigns fetched successfully!');
};
