import type { ICampaign } from '@/common/interfaces';
import { AppError, AppResponse } from '@/common/utils';
import { campaignModel } from '@/models';
import { Request, Response } from 'express';
import { StatusEnum } from '@/common/constants';

export const stepOne = async (req: Request, res: Response) => {
	const { country, tags, categoryId, campaignId } = req.body;
	const { user } = req;

	if (!country || (tags && !Array.isArray(tags)) || !categoryId) {
		throw new AppError('Country and categoryId are required', 400);
	}

	const existingCampaign = await campaignModel.findOne({ status: { $ne: StatusEnum.APPROVED }, creator: user?._id });

	if (existingCampaign && !campaignId) {
		throw new AppError('Only one incomplete campaign allowed at a time.', 400);
	}

	const filter = campaignId
		? { _id: campaignId, creator: user?._id }
		: { creator: user?._id, status: StatusEnum.DRAFT };
	const update = { country, tags, category: categoryId, creator: user?._id };

	// This creates a new document if not existing {upsert: true} or updates the existing document if it exists based on the filter
	const createdCampaign: ICampaign | null = await campaignModel.findOneAndUpdate(filter, update, {
		new: true,
		runValidators: true,
		upsert: true,
	});

	if (!createdCampaign) {
		throw new AppError('Unable to create or update campaign', 500);
	}

	AppResponse(res, 200, createdCampaign, 'Proceed to step 2');
};
