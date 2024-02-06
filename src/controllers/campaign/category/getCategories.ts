import { AppResponse } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { campaignCategoryModel } from '@/models';
import { Request, Response } from 'express';

export const getCategories = catchAsync(async (req: Request, res: Response) => {
	const categories = await campaignCategoryModel.find();

	return AppResponse(res, 200, categories, 'Success');
});
