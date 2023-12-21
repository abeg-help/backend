import { removeFromCache, setCookie } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/queues/middlewares';
import { UserModel as User } from '@/models';
import { Request, Response } from 'express';

export const signOut = catchAsync(async (req: Request, res: Response) => {
	const { user } = req;

	if (!user) {
		throw new AppError('You are not logged in', 404);
	}

	await removeFromCache(user._id.toString());
	//$unset the refreshToken from the mongodb
	await User.findByIdAndUpdate(user._id, { $unset: { refreshToken: 1 } });

	//clearing the cookies set on the frontend by setting a new cookie with empty values and an expiry time in the past
	setCookie(res, 'abegAccessToken', 'expired', { maxAge: -1 });
	setCookie(res, 'abegRefreshToken', 'expired', { maxAge: -1 });

	AppResponse(res, 200, null, 'Logout successful');
});
