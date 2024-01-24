import { catchAsync } from '../../../middlewares';
import { Request, Response } from 'express';
import { AppResponse } from '@/common/utils';
import { campaignCategoryModel } from '@/models/campaignCategoryModel';
import AppError from '../../../common/utils/appError';

const createCategory = catchAsync(async (req: Request, res: Response) => {
	let { name } = req.body;
	name = name.trim();

	if (!name) {
		throw new AppError('name must not be empty');
	}

	const categoryExist = await campaignCategoryModel.countDocuments({ name });

	if (categoryExist > 0) {
		throw new AppError(`Category already exist with name : ${name}`);
	}

	const category = await campaignCategoryModel.create({ name });

	return AppResponse(res, 201, category, 'Success');
});

export default createCategory;
