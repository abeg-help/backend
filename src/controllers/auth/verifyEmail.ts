import { decodeData, getFromCache, setCache, toJSON } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/middlewares';
import { UserModel } from '@/models';
import { Request, Response } from 'express';

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
	const { token, userId } = req.body;
	if (!token || !userId) {
		throw new AppError('Token and Userid are required!', 400);
	}

	const validToken = await getFromCache(`verification:${userId}`);

	if (!validToken) {
		throw new AppError('Invalid/expired token', 400);
	}

	const decodedToken = await decodeData(token);

	if (!decodedToken.token || decodedToken.token !== validToken) {
		throw new AppError('Invalid token', 400);
	}

	const updatedUser = await UserModel.findByIdAndUpdate(userId, { isEmailVerified: true }, { new: true });

	if (!updatedUser) {
		throw new AppError('Verification failed!', 400);
	}

	await setCache(updatedUser._id.toString(), { ...toJSON(updatedUser, ['password']) });

	AppResponse(res, 200, {}, 'Account successfully verified!');
});
