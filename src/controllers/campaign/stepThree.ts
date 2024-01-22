import { AppResponse, uploadSingleFile } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { campaignModel } from '@/models';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';

export const thirdStep = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?._id;
	const { story, id } = req.body;
	const image = req.file;

	if (!story || !id || !image) {
		throw new AppError('All fields are required!', 400);
	}
	const dateInMilliseconds = DateTime.now().toMillis();
	const fileName = `${userId}/campaigns/${id}/cover/${dateInMilliseconds}.${image.mimetype.split('/')[1]}`;
	const image_url = await uploadSingleFile({
		fileName,
		buffer: image.buffer,
		mimetype: image.mimetype,
	});
	await campaignModel.findByIdAndUpdate(id, { story: story, image: image_url }, { new: true });

	return AppResponse(res, 200, {}, 'Step 3 completed successfully!');
});
