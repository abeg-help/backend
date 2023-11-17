import { IUser } from '@/common/interfaces';
import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import type { Request } from 'express';

interface CustomRequest extends Request {
	user?: IUser;
}

export const session = catchAsync(async (req: CustomRequest) => {
	if (!req.user) {
		throw new AppError('Unauthenticated', 401);
	}
});
