import { toJSON } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/middlewares';
import { Request, Response } from 'express';

export const session = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user;
	if (!currentUser) {
		throw new AppError('Unauthenticated', 401);
	}

	return AppResponse(res, 200, toJSON(currentUser), 'Authenticated');
});
