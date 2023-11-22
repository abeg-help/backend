import { getFromCache } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/middlewares';
import { UserModel } from '@/models';
import { Request, Response } from 'express';

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
	const { token } = req.query;
	const { userId } = req.params;
	if (!userId) {
		throw new AppError('Invalid user ID!', 401);
	}
	if (!token) {
		throw new AppError('Invalid token', 401);
	}

	const user = await UserModel.findById(userId);

	if (!user) {
		throw new AppError('User not found', 404);
	}

	const validToken = await getFromCache(`verification:${userId}`);

	if (!validToken) {
		throw new AppError('Invalid/expired token', 404);
	}

	user.isEmailVerified = true;
	await user.save();

	AppResponse(
		res,
		200,
		user.toJSON(['refreshToken', 'loginRetries', 'lastLogin', 'password', '__v', 'createdAt', 'updatedAt']),
		'Account successfully verified'
	);
});
