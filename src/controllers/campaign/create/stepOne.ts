import type { ICampaign } from '@/common/interfaces';
import { AppError, AppResponse } from '@/common/utils';
import { campaignModel } from '@/models';
import { Request, Response } from 'express';

export const stepOne = async (req: Request, res: Response) => {
	const { country, tags, categoryId } = req.body;
	const { user } = req;
	const { id } = req.query;

	if (!country || !tags || !categoryId) {
		throw new AppError('Please provide required details', 400);
	}

	const filter = id ? { _id: id, isComplete: false, creator: user?._id } : { isComplete: false, creator: user?._id };
	const update = { country, tags, categoryId };

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
