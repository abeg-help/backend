import type { IUser } from '@/common/interfaces';
import { AppError, AppResponse, decodeData, getFromCache, removeFromCache } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { UserModel } from '@/models';
import { Request, Response } from 'express';

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
	const { token } = req.body;

	if (!token) {
		throw new AppError('Token is required');
	}

	const decryptedToken = await decodeData(token);

	if (!decryptedToken.id) {
		throw new AppError('Invalid verification token');
	}

	const cachedUser = (await getFromCache(decryptedToken.id)) as IUser;

	if (cachedUser && cachedUser.isEmailVerified) {
		return AppResponse(res, 200, {}, 'Account already verified!');
	}

	const updatedUser = await UserModel.findByIdAndUpdate(decryptedToken.id, { isEmailVerified: true }, { new: true });

	if (!updatedUser) {
		throw new AppError('Verification failed!', 400);
	}

	await removeFromCache(updatedUser._id.toString());

	AppResponse(res, 200, {}, 'Account successfully verified!');
});
