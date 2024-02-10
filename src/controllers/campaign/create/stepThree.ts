import { AppError, AppResponse, uploadSingleFile } from '@/common/utils';
import { campaignModel } from '@/models';
import { CampaignJobEnum, campaignQueue } from '@/queues';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { StatusEnum } from '@/common/constants';

export const stepThree = async (req: Request, res: Response) => {
	const { story, storyHtml } = req.body;
	const { user } = req;
	const { id } = req.query;
	const files = req.files as Express.Multer.File[];

	if (!id) {
		throw new AppError('Id is required');
	}

	if (!story) {
		throw new AppError('Please provide required details', 400);
	}

	// this enables to ensure user is not trying to update a non-existent or complete campaign from step 3 creation flow
	// helps save aws resources by early return
	const campaignExist = await campaignModel.findOne({ _id: id, creator: user?._id });

	if (!campaignExist) {
		throw new AppError(`Unable to process request , try again later`, 404);
	}

	const uploadedFiles =
		files.length > 0
			? await Promise.all([
					...files.map(async (file, index) => {
						const dateInMilliseconds = DateTime.now().toMillis();
						const fileName = `${user!._id}/campaigns/${id}/${index}_${dateInMilliseconds}.${
							file.mimetype.split('/')[1]
						}`;

						return await uploadSingleFile({
							fileName,
							buffer: file.buffer,
							mimetype: file.mimetype,
						});
					}),
				])
			: [];

	const updatedCampaign = await campaignModel.findOneAndUpdate(
		{ _id: id, creator: user?._id },
		{
			images: [...campaignExist.images, ...uploadedFiles],
			story,
			storyHtml,
			status: StatusEnum.IN_REVIEW,
		},
		{ new: true }
	);

	if (!updatedCampaign) {
		throw new AppError(`Unable to process request , try again later`, 404);
	}

	console.log('updated campaign id', updatedCampaign._id.toString());

	// add campaign to queue for auto processing and check
	await campaignQueue.add(CampaignJobEnum.PROCESS_CAMPAIGN_REVIEW, { id: updatedCampaign._id.toString() });

	AppResponse(res, 200, updatedCampaign, 'Campaign Created Successfully');
};
