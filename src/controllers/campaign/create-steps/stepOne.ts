import AppError from '@/common/utils/appError';
import { Request, Response } from 'express';
import { campaignModel } from '@/models/campaignModel';
import { AppResponse } from '@/common/utils';
import { ICampaign } from '../../../common/interfaces/campaign';

const stepOne = async (req: Request, res: Response) => {
	const { country, tags, categoryId } = req.body;
	const { user } = req;
	const { id } = req.query;

	if (!country || !tags || !categoryId) {
		throw new AppError('Please provide required details', 400);
	}

	const userCampaign = await campaignModel.findOne(
		id ? { _id: id, isComplete: false, creator: user?._id } : { isComplete: false, creator: user?._id }
	);

	let createdCampaign: ICampaign | null;

	if (userCampaign) {
		createdCampaign = await campaignModel.findOneAndUpdate({ _id: userCampaign._id }, { country, tags, categoryId });
	} else {
		createdCampaign = await campaignModel.create({ country, tags, categoryId, creator: user!._id });
	}

	AppResponse(res, 200, createdCampaign, 'Proceed to step 2');
};

export default stepOne;