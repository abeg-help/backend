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
				creator: user._id,
				status: 'APPROVED',
			},
		},
		{
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
				_id: {
					userId: '$_id',
					country: '$donations.donorIpMeta.country',
				},
				campaignCount: {
					$sum: 1,
				},
				totalAmountRaised: {
					$sum: '$amountRaised',
				},
				donorsCount: { $sum: '$donations' },
				donations: { $push: '$donations' },
			},
		},
		{
			$group: {
				_id: '$_id.userId',
				campaignCount: { $first: '$campaignCount' },
				totalAmountRaised: {
					$first: '$totalAmountRaised',
				},
				donorsByCountry: {
					$push: {
						country: '$_id.country',
						count: { $size: '$donations' },
					},
				},
			},
		},
		{
			$project: {
				name: 1,
				campaignCount: 1,
				totalAmountRaised: 1,
				donorsByCountry: 1,
			},
		},
	];
	const result = await campaignModel.aggregate(pipeline);
	return AppResponse(res, 200, result, 'Stats fetched successfully');
});
