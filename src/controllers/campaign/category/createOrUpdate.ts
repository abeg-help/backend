import { AppError, AppResponse, uploadSingleFile } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { campaignCategoryModel } from '@/models';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';

export const createOrUpdateCategory = catchAsync(async (req: Request, res: Response) => {
	let { name, categoryId } = req.body;
	name = name.trim();
	const image = req.file;

	if (!name) {
		throw new AppError('name must not be empty');
	}

	const categoryExist = await campaignCategoryModel.countDocuments({ name });

	if (categoryExist > 0) {
		throw new AppError(`Category already exist with name : ${name}`);
	}

	let category: unknown;

	const dateInMilliseconds = DateTime.now().toMillis();
	const fileName = `category/${name}/${dateInMilliseconds}.${image?.mimetype.split('/')[1]}`;

	const uploadedImage = image
		? await uploadSingleFile({
				fileName,
				buffer: image.buffer,
				mimetype: image.mimetype,
			})
		: null;

	if (categoryId) {
		category = await campaignCategoryModel.findByIdAndUpdate(
			categoryId,
			{
				name,
				...(uploadedImage && { image: uploadedImage }),
			},
			{ new: true }
		);
	} else {
		category = await campaignCategoryModel.create({ name, ...(uploadedImage && { image: uploadedImage }) });
	}

	if (!category) {
		throw new AppError(`Unable to ${categoryId ? 'Update' : 'Create'} category, try again later`, 400);
	}

	return AppResponse(res, 201, category, 'Success');
});
