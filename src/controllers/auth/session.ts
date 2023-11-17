import { CustomRequest } from '@/common/interfaces';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/middlewares';
import { Response } from 'express';

export const session = catchAsync(async (req: CustomRequest, res: Response) => {
	const currentUser = req.user;
	if (!currentUser) {
		throw new AppError('Unauthenticated', 401);
	}

	return AppResponse(res, 200, currentUser, 'Authenticated');
});
