import { AppError, AppResponse } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { campaignModel } from '@/models';
import { Request, Response } from 'express';
import { PipelineStage } from 'mongoose';

export const getCampaignStats = catchAsync(async (req: Request, res: Response) => {
	const { user } = req;
	if (!user) {
		throw new AppError('Unauthorized, kindly login again.');
	}
	const pipeline: PipelineStage[] = [
		{
			$match: {
				creator: user,
			},
			$lookup: {
				from: 'donations',
				localField: '_id',
				foreignField: 'campaignId',
				as: 'donations',
			},
		},
		{
			$unwind: '$donations',
		},
		{
			$match: {
				'donations.paymentStatus': 'PAID', // matching only donations that the payment is successful
			},
		},

		{
			$group: {
				_id: null,
				campaignCount: { $sum: 1 },
				totalAmountRaised: { $sum: '$amountRaised' },
				donorsCount: { $sum: '$donations' },
				donations: { $push: '$donations' },
			},
		},
		{
			$project: {
				_id: 0,
				campaignCount: 1,
				totalAmountRaised: 1,
				donorsCount: 1,
				donors: { $addToSet: '$donations.donorIpMeta.country' }, // Group donors by country
			},
		},
		{
			$group: {
				_id: '$donors',
				donorsByCountry: { $sum: 1 },
			},
		},
	];

	const result = await campaignModel.aggregate(pipeline);
	return AppResponse(res, 200, result, 'Stats fetched successfully');
});
