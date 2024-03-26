import { AppResponse } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { campaignCategoryModel } from '@/models';
import { Request, Response } from 'express';

export const getCategories = catchAsync(async (req: Request, res: Response) => {
	let categories = await campaignCategoryModel.aggregate([
		{
			$lookup: {
				from: 'campaigns',
				localField: '_id',
				foreignField: 'category',
				as: 'campaigns',
			},
		},
		{
			$addFields: {
				count: { $size: '$campaigns' },
			},
		},
		{
			$project: {
				campaigns: 0,
			},
		},
	]);

	categories = categories.map((category) => {
		const count = category.count;
		let formattedCount = '';
		if (count >= 1000000000000) {
			formattedCount = Math.floor(count / 100000000000) / 10 + 't';
		} else if (count >= 1000000000) {
			formattedCount = Math.floor(count / 100000000) / 10 + 'b';
		} else if (count >= 1000000) {
			formattedCount = Math.floor(count / 100000) / 10 + 'm';
		} else if (count >= 1000) {
			formattedCount = Math.floor(count / 100) / 10 + 'k';
		} else {
			formattedCount = count.toString();
		}

		// Add + if count is not a multiple of 1000 and is greater than or equal to 1000
		if (count % 1000 > 0 && count >= 1000) {
			formattedCount += '+';
		}

		return { ...category, count: formattedCount };
	});

	return AppResponse(res, 200, categories, 'Success');
});
