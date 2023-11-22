import { getFromCache } from '@/common/utils';
import AppError from '@/common/utils/appError';
// import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/middlewares';
// import { UserModel } from '@/models';
import { Request } from 'express';

export const verifyEmail = catchAsync(async (req: Request) => {
	const { token, userId } = req.body;
	if (!userId) {
		throw new AppError('Invalid user ID!', 401);
	}
	if (!token) {
		throw new AppError('Invalid token', 401);
	}

	const user = await getFromCache(userId);

	if (!user) {
		throw new AppError('User not found', 404);
	}

	const validToken = await getFromCache(`verification:${userId}`);

	if (!validToken) {
		throw new AppError('Invalid/expired token', 404);
	}
});
