import { AppError, AppResponse } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { campaignCategoryModel } from '@/models';
import { Request, Response } from 'express';

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
	const { categoryId } = req.body;

	if (!categoryId) {
		throw new AppError('categoryId is required');
	}

	const response = await campaignCategoryModel.findOneAndUpdate(
		{
			_id: categoryId,
		},
		{
			isDeleted: true,
		}
	);

	if (!response) {
		throw new AppError('Category does not exist');
	}

	return AppResponse(res, 200, null, 'Success');
});
