import { AppResponse } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { campaignCategoryModel } from '@/models/campaignCategoryModel';
import { Request, Response } from 'express';

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
	const categoryId = req.params.categoryId;

	if (!categoryId) {
		throw new AppError('Provide the ID of the category to delete', 400);
	}

	const deletedCategory = await campaignCategoryModel.findByIdAndDelete(categoryId);

	if (!deletedCategory) {
		throw new AppError('Category not found or not deleted.', 404);
	}

	return AppResponse(res, 200, null, 'Category deleted successfully');
});

export default deleteCategory;
