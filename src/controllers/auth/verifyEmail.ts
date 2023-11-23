import { decryptData, getFromCache, setCache } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/middlewares';
import { UserModel } from '@/models';
import { Request, Response } from 'express';

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
	const { token, userId } = req.body;
	if (!token || !userId) {
		throw new AppError('All fields are required!', 400);
	}

	const user = await getFromCache(userId);

	if (!user) {
		throw new AppError('User not found', 404);
	}

	const validToken = await getFromCache(`verification:${userId}`);

	if (!validToken) {
		throw new AppError('Invalid/expired token', 400);
	}

	const decodedToken = await decryptData(token);

	if (!decodedToken.token || decodedToken.token !== validToken) {
		throw new AppError('Invalid token', 400);
	}

	const updatedUser = await UserModel.findByIdAndUpdate(userId, { isEmail: true }, { new: true });

	if (!updatedUser) {
		throw new AppError('Invalid/expired token', 404);
	}

	await setCache(updatedUser._id.toString(), updatedUser.toJSON(['password']));

	AppResponse(res, 200, {}, 'Account successfully verified!');
});
