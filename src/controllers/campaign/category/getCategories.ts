import { catchAsync } from '../../../middlewares';
import { Request, Response } from 'express';
import { AppResponse } from '@/common/utils';
import { campaignCategoryModel } from '@/models/campaignCategoryModel';

const getCategories = catchAsync(async (req: Request, res: Response) => {
	const categories = await campaignCategoryModel.find();

	return AppResponse(res, 200, categories, 'Success');
});

export default getCategories;
