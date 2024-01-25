import { AppResponse } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { campaignCategoryModel } from '@/models/campaignCategoryModel';
import { Request, Response } from 'express';

const updateCategory = catchAsync(async (req: Request, res: Response) => {
	const { name } = req.body;

	if (!name) {
		throw new AppError('Provide the name of the category you want to update', 400);
	}

	const filter = { _id: req.params.categoryId };

	const update = { $set: { name } };

	const updatedCategory = await campaignCategoryModel.findOneAndUpdate(filter, update, { new: true });

	if (!updatedCategory) {
		throw new AppError('Category not found or not updated.', 404);
	}

	return AppResponse(res, 200, updatedCategory, 'Updated category');
});

export default updateCategory;
