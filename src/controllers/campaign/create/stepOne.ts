import { AppError, AppResponse } from '@/common/utils';
import { campaignModel } from '@/models';
import { Request, Response } from 'express';
import { StatusEnum } from '@/common/constants';
import { CampaignJobEnum, campaignQueue } from '@/queues';

export const stepOne = async (req: Request, res: Response) => {
	const { country, tags, categoryId, campaignId } = req.body;
	const { user } = req;

	if (!country || (tags && !Array.isArray(tags)) || !categoryId) {
		throw new AppError('Country and categoryId are required', 400);
	}

	const existingCampaign = await campaignModel.findOne({ status: StatusEnum.DRAFT, creator: user?._id });

	if (existingCampaign && !campaignId) {
		throw new AppError('Only one draft campaign allowed at a time.', 400);
	}

	let campaign;

	if (campaignId) {
		campaign = await campaignModel.findOneAndUpdate(
			{
				_id: campaignId,
				creator: user?._id,
				status: { $ne: StatusEnum.APPROVED },
			},
			{
				$set: {
					country: country,
					tags: tags,
					category: categoryId,
					creator: user?._id,
					status: {
						$cond: {
							if: { $eq: ['$status', StatusEnum.REJECTED] },
							then: StatusEnum.IN_REVIEW,
							else: '$status',
						},
					},
				},
			}
		);

		if (campaign.status === StatusEnum.IN_REVIEW) {
			// add campaign to queue for auto processing and check
			await campaignQueue.add(CampaignJobEnum.PROCESS_CAMPAIGN_REVIEW, { id: campaign?._id?.toString() });
		}
	} else {
		campaign = await campaignModel.create({
			country,
			tags,
			category: categoryId,
			creator: user?._id,
			status: StatusEnum.DRAFT,
			currentStep: 1,
		});
	}

	if (!campaign) {
		throw new AppError('Unable to create or update campaign', 500);
	}

	AppResponse(res, 200, campaign, 'Proceed to step 2');
};
