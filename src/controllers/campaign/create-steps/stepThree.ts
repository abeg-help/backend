import AppError from '@/common/utils/appError';
import { Request, Response } from 'express';
import { campaignModel } from '@/models/campaignModel';
import { AppResponse, uploadSingleFile } from '@/common/utils';
import { DateTime } from 'luxon';
import { CampaignJobEnum, campaignQueue } from '../../../queues/campaignQueue';

const stepThree = async (req: Request, res: Response) => {
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

	if (!files || files.length < 1) {
		throw new AppError(`File is required`, 400);
	}

	// this enable to ensure user is not trying to update a non existent or complete campaign from step 3 creation flow
	// helps save aws resources by early return
	const campaignExist = await campaignModel.findOne({ _id: id, isComplete: false, creator: user?._id });

	if (!campaignExist) {
		throw new AppError(`Unable to process request , try again later`, 404);
	}

	const uploadedFiles = await Promise.all([
		...files.map(async (file, index) => {
			const dateInMilliseconds = DateTime.now().toMillis();
			const fileName = `${user!._id}/campaigns/${id}/${index}_${dateInMilliseconds}.${file.mimetype.split('/')[1]}`;

			return await uploadSingleFile({
				fileName,
				buffer: file.buffer,
				mimetype: file.mimetype,
			});
		}),
	]);

	const updatedCampaign = await campaignModel.findOneAndUpdate(
		{ _id: id, isComplete: false, creator: user?._id },
		{
			image: uploadedFiles,
			story,
			storyHtml,
			isComplete: true,
		},
		{ new: true }
	);

	if (!updatedCampaign) {
		throw new AppError(`Unable to process request , try again later`, 404);
	}

	// add campaign to queue for auto processing and check
	campaignQueue.add(CampaignJobEnum.PROCESS_CAMPAIGN_REVIEW, { id: updatedCampaign._id });

	AppResponse(res, 200, updatedCampaign, 'Campaign Created Successfully');
};

export default stepThree;
