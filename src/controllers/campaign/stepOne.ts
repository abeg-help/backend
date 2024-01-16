import AppError from '@/common/utils/appError';
import { Request, Response } from 'express';
import { campaignModel as campaign } from '@/models/campaignModel';
import { AppResponse } from '@/common/utils';

const stepOne = async (req: Request, res: Response) => {
	const { country, tags, description } = req.body;
	const { user } = req;
	if (!user) {
		throw new AppError('user not defined', 400);
	}
	if (!country || !tags || !description) {
		throw new AppError('Please provide required details', 400);
	}
	await campaign.create({ country, tags, description, campaignCreator: user._id });
	AppResponse(res, 200, null, 'Proceed to step 2');
};

export default stepOne;
