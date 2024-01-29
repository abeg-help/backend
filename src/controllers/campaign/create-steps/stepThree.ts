import AppError from '@/common/utils/appError';
import { Request, Response } from 'express';
import { campaignModel } from '@/models/campaignModel';
import { AppResponse, uploadSingleFile } from '@/common/utils';
import { DateTime } from 'luxon';
import { CampaignJobEnum, campaignQueue } from '../../../queues/campaignQueue';

const stepThree = async (req: Request, res: Response) => {
	const { story } = req.body;
	const { user, file } = req;
	const { id } = req.query;

	if (!id) {
		throw new AppError('Id is required');
	}

	if (!story) {
		throw new AppError('Please provide required details', 400);
	}

	if (!file) {
		throw new AppError(`File is required`, 400);
	}

	const dateInMilliseconds = DateTime.now().toMillis();
	const fileName = `${user?._id}/campaigns/${id}/${dateInMilliseconds}.${file.mimetype.split('/')[1]}`;

	const uploadedFile = await uploadSingleFile({
		fileName,
		buffer: file.buffer,
		mimetype: file.mimetype,
	});

	const updatedCampaign = await campaignModel.findOneAndUpdate(
		{ _id: id, isComplete: false, creator: user?._id },
		{
			image: uploadedFile,
			story,
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
